import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Contact } from '../../contacts/models/contact';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from '../../../ui/alert/alert.service';
import { ContactService } from '../../service/contact.service';
import { DropdownService } from '../../ui/service/dropdown.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-activity-form',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit {

  contact: Contact;
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private contactService: ContactService,
    private alertService: AlertService, private router: Router, private dropDownService: DropdownService) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams['contactId']) {
      this.loadContact();
    }
  }

  private loadContact() {
    let contact$ = this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) =>
        this.contactService.fetchById(params.get('contactId')))
    );

    contact$.subscribe(
      (contact: Contact) => this.handleContactResponse(contact),
      err => this.handleContactError(err)
    );
  }

  private handleContactResponse(contact: Contact) {
    this.contact = contact;
    this.loading = false;
  }

  private handleContactError(err: Error) {
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
