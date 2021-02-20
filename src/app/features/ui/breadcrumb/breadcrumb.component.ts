import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, ParamMap, Router, ActivatedRouteSnapshot, UrlSegment, NavigationEnd } from "@angular/router";
import { menu } from '../model/menu';
import { filter, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
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
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
          console.log(route);
        }
        return route;
      })
    ).subscribe((route: ActivatedRoute) => this.handleCurrentRoute(route));
  }

  private handleCurrentRoute(route: ActivatedRoute) {
    let url: string = this.router.url;
    if (url) {
      this.currentUrl = url.substring(1);
    }

    console.log(this.router.url);
    console.log(menu);

    route.data.subscribe((data: any) => console.log(data));

    let navItem: NavItem = this.findRoute(menu, route);
    console.log("Now I've got ", navItem);

    if (navItem) {
      console.log("Top-level breadcrumb");
      this.breadcrumbs = [];

      let breadcrumb: Breadcrumb = { name: navItem.displayName, url: navItem.route };
      this.breadcrumbs.push(breadcrumb);
      console.log(this.breadcrumbs);
    }
    //let bogus = route.data as BehaviorSubject<any>;
    //console.log(bogus.getValue()['breadcrumb']);
  }

  private findRoute(navItems: NavItem[], route: ActivatedRoute): NavItem {
    let returnedItem: NavItem = null;

    if (this.currentUrl) {
      for (let item of navItems) {
        if (this.currentUrl == item.route) {
          returnedItem = item;
          break;
        } else if (item.children) {
          returnedItem = this.findRoute(item.children, route);
          if (returnedItem != null) break;
        }
      }
    }

    //console.log("Returning ", returnedItem);
    return returnedItem;
  }
}
