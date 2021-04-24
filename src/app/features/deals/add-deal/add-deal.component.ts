import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from 'carey-alert';
import { HttpErrorResponse } from '@angular/common/http';
import { Deal } from '../models/deal';
import { Contact } from '../../contacts/models/contact';
import { ContactService } from '../../contacts/services/contact.service';


@Component({
  selector: 'app-add-deal',
  templateUrl: './add-deal.component.html',
  styleUrls: ['./add-deal.component.css']
})
export class AddDealComponent implements OnInit {

  contact: Contact;
  loading: boolean = true;

  constructor(private route: ActivatedRoute,
    private alertService: AlertService, private router: Router,
    private contactService: ContactService) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['contactId']) {
      this.loadContact();
    } else {
      this.loading = false;
    }
  }

  private loadContact() {
    if (this.route.snapshot.queryParams['contactId']) {
      let contact$ = this.route.queryParamMap.pipe(
        switchMap((params: ParamMap) =>
          this.contactService.fetchById(params.get('contactId')))
      );

      contact$.subscribe(
        (contact: Contact) => this.handleContactResponse(contact),
        err => this.handleContactError(err)
      );
    }
  }

  private handleContactResponse(contact: Contact) {
    this.contact = contact;
    this.loading = false;
  }

  private handleContactError(err: Error) {
    this.loading = false;
    console.error(err);

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
