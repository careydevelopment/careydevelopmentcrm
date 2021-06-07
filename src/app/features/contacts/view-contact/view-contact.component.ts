import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Contact } from '../models/contact';
import { AlertService } from 'carey-alert';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { linesOfBusiness } from '../constants/line-of-business';
import { contactStatuses } from '../constants/contact-status';
import { BreadcrumbService } from '../../../ui/breadcrumb/breadcrumb.service';
import { DisplayValueMap } from '../../../models/name-value-map';
import { DisplayValueMapService } from '../../ui/service/display-map.service';
import { ContactService } from '../services/contact.service';
import { sources } from '../../../models/source';
import { addressTypes } from '../../../models/address-type';
import { phoneTypes } from '../../../models/phone-type';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-view-contact',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.css']
})
export class ViewContactComponent implements OnInit {

  availableAddressTypes: DisplayValueMap[] = addressTypes;
  availablePhoneTypes: DisplayValueMap[] = phoneTypes;
  availableLobTypes: DisplayValueMap[] = linesOfBusiness;
  availableContactStatuses: DisplayValueMap[] = contactStatuses;
  availableSources: DisplayValueMap[] = sources;

  contact$: Observable<Contact>;

  constructor(private route: ActivatedRoute, private contactService: ContactService,
    private alertService: AlertService, private router: Router, private displayValueMapService: DisplayValueMapService,
    private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    this.contact$ = this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) =>
        this.contactService.fetchById(params.get('id')).pipe(
          tap(contact => this.handleBreadcrumb(contact)),
          catchError(err => this.handleError(err))
        )
      )
    );
  }

  private handleBreadcrumb(contact: Contact) {
    if (contact) {
      this.breadcrumbService.updateBreadcrumb("View " + contact.firstName + " " + contact.lastName);
    }
  }

  private handleError(err: Error): Observable<Contact> {
    console.log(err);
    let alertMessage: string = 'Something went wrong, please call support';

    if (err instanceof HttpErrorResponse) {
      if (err.status) {
        if (err.status == 404) {
          alertMessage = 'Contact with that ID does not exist';
        }
      }
    }

    this.alertService.error(alertMessage);

    return of(null);
  }

  editContact(id: string) {
    let route = '/contacts/edit-contact';
    this.router.navigate([route], { queryParams: { id: id } });
  }
}
