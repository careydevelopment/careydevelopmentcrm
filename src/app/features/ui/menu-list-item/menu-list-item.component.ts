import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NavItem } from '../model/nav-item';
import { Router } from '@angular/router';
import { NavService } from '../service/nav.service';
import { ConfirmationDialogComponent } from '../../../ui/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogModel } from '../../../ui/confirmation-dialog/confirmation-dialog';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthenticationService } from 'carey-auth';

@Component({
    selector: 'app-menu-list-item',
    templateUrl: './menu-list-item.component.html',
    styleUrls: ['./menu-list-item.component.css'],
    animations: [
        trigger('indicatorRotate', [
            state('collapsed', style({ transform: 'rotate(0deg)' })),
            state('expanded', style({ transform: 'rotate(180deg)' })),
            transition('expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
            ),
        ])
    ]
})
export class MenuListItemComponent implements OnInit {
    expanded: boolean = false;

    @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
    @Input() item: NavItem;
    @Input() depth: number;

  constructor(public navService: NavService, public router: Router,
    private authenticationService: AuthenticationService, private dialog: MatDialog) {

        if (this.depth === undefined) {
            this.depth = 0;
        }
    }

    ngOnInit() {
        this.navService.getCurrentUrl().subscribe((url: string) => {
            if (this.item.route) {
                this.expanded = url.indexOf(`/${this.item.route}`) === 0;
                this.ariaExpanded = this.expanded;
            }
        });
    }

    onItemSelected(item: NavItem) {
        this.dialog.closeAll();

        if (!item.children || !item.children.length) {
            if (item.route) {
                this.router.navigate([item.route]);
            } else {
                this.handleSpecial(item);
            }
        } 

        if (item.children && item.children.length) {
            this.expanded = !this.expanded;
        }
    }

    handleSpecial(item: NavItem) {
        if (item.displayName == 'Sign Out') {
            this.handleSignOut();
        }
    }

    handleSignOut() {
        const dialogData = new ConfirmationDialogModel('Confirm', 'Are you sure you want to logout?');
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            maxWidth: '400px',
            closeOnNavigation: true,
            data: dialogData
        })

        dialogRef.afterClosed().subscribe(dialogResult => {
          if (dialogResult) {
              this.authenticationService.logout();
            }
        });
  }
}
