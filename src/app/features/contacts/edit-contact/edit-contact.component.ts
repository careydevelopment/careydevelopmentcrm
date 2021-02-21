import { Component, OnInit } from '@angular/core';
import { DropdownOption } from '../../ui/model/dropdown-option';
import { phoneTypes } from '../constants/phone-type';
import { addressTypes } from '../constants/address-type';
import { linesOfBusiness } from '../constants/line-of-business';
import { contactStatuses } from '../constants/contact-status';
import { sources } from '../constants/source';
import { DropdownService } from '../../ui/service/dropdown.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ContactService } from '../../service/contact.service';
import { Contact } from '../models/contact';
import { switchMap } from 'rxjs/operators';
import { AlertService } from '../../../ui/alert/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BreadcrumbService } from '../../../ui/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {

  availableAddressTypes: DropdownOption[] = addressTypes;
  availablePhoneTypes: DropdownOption[] = phoneTypes;
  availableLobTypes: DropdownOption[] = linesOfBusiness;
  availableContactStatuses: DropdownOption[] = contactStatuses;
  availableSources: DropdownOption[] = sources;


  loading: boolean = true;
  contact: Contact = {} as Contact;

  constructor(private route: ActivatedRoute, private contactService: ContactService,
    private alertService: AlertService, private dropDownService: DropdownService,
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
    this.breadcrumbService.updateBreadcrumb("Edit " + this.contact.firstName + " " + this.contact.lastName);
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
}
