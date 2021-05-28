import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../../models/contact';

@Component({
  selector: 'app-view-contact-menu',
  templateUrl: './view-contact-menu.component.html',
  styleUrls: ['./view-contact-menu.component.css']
})
export class ViewContactMenuComponent implements OnInit {

  @Input() contact: Contact;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  addAppointment() {
    let route = '/activities/add-activity';
    this.router.navigate([route], { queryParams: { contactId: this.contact.id, type: 'APPOINTMENT' } });  }

  addActivity() {
    let route = '/activities/add-activity';
    this.router.navigate([route], { queryParams: { contactId: this.contact.id } });
  }

  addDeal() {
    let route = '/deals/add-deal';
    this.router.navigate([route], { queryParams: { contactId: this.contact.id } });
  }
}
