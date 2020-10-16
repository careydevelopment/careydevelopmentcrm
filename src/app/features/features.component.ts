import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { VERSION } from '@angular/material/core';
import { NavItem } from './ui/model/nav-item';
import { NavService } from './nav.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements AfterViewInit {

    //@ViewChild('appDrawer') appDrawer: ElementRef;
    version = VERSION;
    navItems: NavItem[] = [
        {
            displayName: 'DevFestFL',
            iconName: 'recent_actors',
            route: 'devfestfl',
            children: [
                {
                    displayName: 'Speakers',
                    iconName: 'group',
                    route: '/dashboard'
                },
                {
                    displayName: 'Sessions',
                    iconName: 'speaker_notes',
                    route: 'devfestfl/sessions'
                },
                {
                    displayName: 'Feedback',
                    iconName: 'feedback',
                    route: 'devfestfl/feedback'
                }
            ]
        },
        {
            displayName: 'Disney',
            iconName: 'videocam',
            route: 'disney',
            children: [
                {
                    displayName: 'Speakers',
                    iconName: 'group',
                    route: 'disney/speakers'
                },
                {
                    displayName: 'Sessions',
                    iconName: 'speaker_notes',
                    route: 'disney/sessions'
                },
                {
                    displayName: 'Feedback',
                    iconName: 'feedback',
                    route: 'disney/feedback'
                }
            ]
        },
        {
            displayName: 'Dashboard',
            iconName: 'recent_actors',
            route: 'dashboard'
        }
    ];

    constructor(private navService: NavService) {
    }

    ngAfterViewInit() {
    //    this.navService.appDrawer = this.appDrawer;
    }

}
