import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { VERSION } from '@angular/material/core';
import { NavItem } from './ui/model/nav-item';
import { NavService } from './ui/service/nav.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements AfterViewInit {

    //@ViewChild('appDrawer') appDrawer: ElementRef;
    version = VERSION;
    opened: boolean = true;

    navItems: NavItem[] = [
        {
            displayName: 'Dashboard',
            iconName: 'dashboard',
            route: 'dashboard'
        },
        {
        displayName: 'User',
        iconName: 'face',
        route: 'user',
        children: [
            {
                displayName: 'Account Info',
                iconName: 'account_box',
                route: 'user/account-info'
            }
          ]
        }
    ];

    constructor(private navService: NavService) {
    }

    ngAfterViewInit() {
    //    this.navService.appDrawer = this.appDrawer;
    }
}
