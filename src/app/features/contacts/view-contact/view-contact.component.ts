import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ContactService } from '../../service/contact.service';
import { Contact } from '../models/contact';
import { AlertService } from '../../../ui/alert/alert.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.css']
})
export class ViewContactComponent implements OnInit {

  loading: boolean = true;
  contact: Contact = {} as Contact;

  constructor(private route: ActivatedRoute, private contactService: ContactService,
    private alertService: AlertService) { }

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
