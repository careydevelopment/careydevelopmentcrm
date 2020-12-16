import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router, Route } from '@angular/router';
import { ContactService } from '../../service/contact.service';
import { Contact } from '../models/contact';


@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {

  loading: boolean = true;
  contact: Contact = {} as Contact;

  constructor(private route: ActivatedRoute, private contactService: ContactService) { }

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
  }

}
