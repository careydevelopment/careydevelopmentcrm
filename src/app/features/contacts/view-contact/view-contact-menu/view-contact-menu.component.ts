import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../../models/contact';

@Component({
  selector: 'app-view-contact-menu',
  templateUrl: './view-contact-menu.component.html',
  styleUrls: ['./view-contact-menu.component.css']
})
export class ViewContactMenuComponent implements OnInit {

  @Input() contact: Contact;

  constructor() { }

  ngOnInit(): void {
  }

  addAppointment() {
    console.log("Adding appointment for " + this.contact);
  }

  addActivity() {
    console.log("Adding activity for " + this.contact);
  }
}
