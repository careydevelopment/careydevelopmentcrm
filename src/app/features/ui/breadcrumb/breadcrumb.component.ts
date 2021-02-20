import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, ParamMap, Router, ActivatedRouteSnapshot, UrlSegment, NavigationEnd } from "@angular/router";
import { menu } from '../model/menu';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';
import { NavItem } from '../model/nav-item';
import { Breadcrumb } from './breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumbs: Breadcrumb[] = [];
  currentUrl: string = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute,) { }

  ngOnInit() {
    this.listenForRouteChange();
  }

  private listenForRouteChange() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      distinctUntilChanged()
    ).subscribe(
      (route: ActivatedRoute) => this.handleCurrentRoute(route)
    );
  }

  private setCurrentUrl() {
    let url: string = this.router.url;

    if (url) {
      this.currentUrl = url.substring(1);

      //don't need the parameter query list here
      let paramPos: number = this.currentUrl.indexOf("?");
      if (paramPos > -1) {
        this.currentUrl = this.currentUrl.substring(0, paramPos);
      }
    }
  }

  private handleCurrentRoute(route: ActivatedRoute) {
    this.setCurrentUrl();

    console.error("handling", route);
    //console.log(menu);

    let navItem: NavItem = this.findRoute(route, menu);
    console.log("Now I've got ", navItem);

    if (navItem) {
      //if we get here, the user clicked on item on the sidebar
      //we'll reset the breadcrumbs to start over
      this.handleTopLevelBreadcrumb(navItem);
    } else {
      //if we get here, the user clicked a link in the main content sectio
      //we'll add to the breadcrumbs
      this.addBreadcrumb(route);
    }
  }

  private addBreadcrumb(route: ActivatedRoute) {
    console.log(route);

    let breadcrumb: Breadcrumb = {} as Breadcrumb;

    route.data.subscribe((data: any) => {
      breadcrumb = { name: data.breadcrumb, url: this.currentUrl };
    });

    route.queryParams.subscribe((queryParams: any) => {
      if (queryParams) {
        breadcrumb.queryParams = queryParams;
      }
    });

    this.breadcrumbs.push(breadcrumb);
  }

  private handleTopLevelBreadcrumb(navItem: NavItem) {
    //console.log("Top-level breadcrumb");
    this.breadcrumbs = [];

    let breadcrumb: Breadcrumb = { name: navItem.displayName, url: navItem.route };

    this.breadcrumbs.push(breadcrumb);
    //console.log(this.breadcrumbs);
  }

  private findRoute(route: ActivatedRoute, navItems?: NavItem[]): NavItem {
    if (!navItems) navItems = menu;

    let returnedItem: NavItem = null;

    if (this.currentUrl) {
      for (let item of navItems) {
        if (this.currentUrl == item.route) {
          returnedItem = item;
          break;
        } else if (item.children) {
          returnedItem = this.findRoute(route, item.children);
          if (returnedItem != null) break;
        }
      }
    }

    //console.log("Returning ", returnedItem);
    return returnedItem;
  }

  routeTo(index: number) {
    console.log(this.breadcrumbs[index]);

    let breadcrumb: Breadcrumb = this.breadcrumbs[index];

    let route = breadcrumb.url;
    this.router.navigate([route], { queryParams: breadcrumb.queryParams });
  }
}
