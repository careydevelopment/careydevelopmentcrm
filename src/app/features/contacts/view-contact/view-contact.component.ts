import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { switchMap } from 'rxjs/operators';
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

  loading: boolean = true;
  contact: Contact = {} as Contact;

  constructor(private route: ActivatedRoute, private contactService: ContactService,
    private alertService: AlertService, private router: Router, private displayValueMapService: DisplayValueMapService,
    private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    let contact$ = this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) =>
        this.contactService.fetchById(params.get('id')))
    );

    contact$.subscribe(
      (contact: Contact) => this.handleResponse(contact),
      err => this.handleError(err)
    );
  }

  private handleResponse(contact: Contact) {
    this.contact = contact;
    this.loading = false;

    if (this.contact) {
      this.breadcrumbService.updateBreadcrumb("View " + this.contact.firstName + " " + this.contact.lastName);
    }
  }

  private handleError(err: Error) {
    console.log(err);
    this.loading = false;

    let alertMessage: string = 'Something went wrong, please call support';

    if (err instanceof HttpErrorResponse) {
      if (err.status) {
        if (err.status == 404) {
          alertMessage = 'Contact with that ID does not exist';
        }
      }
    }

    this.alertService.error(alertMessage);
  }

  editContact() {
    let route = '/contacts/edit-contact';
    this.router.navigate([route], { queryParams: { id: this.contact.id } });
  }
}
