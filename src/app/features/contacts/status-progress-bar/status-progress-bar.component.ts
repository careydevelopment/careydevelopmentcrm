import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../models/contact';
import { contactStatuses } from '../constants/contact-status';
import { AlertService } from 'carey-alert';
import { DisplayValueMap } from '../../../models/name-value-map';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-status-progress-bar',
  templateUrl: './status-progress-bar.component.html',
  styleUrls: ['./status-progress-bar.component.css']
})
export class StatusProgressBarComponent implements OnInit {

  @Input() contact: Contact;

  availableContactStatuses: DisplayValueMap[] = contactStatuses.filter(status => status.value != 'CUSTOMER');
  contactStatusIndex: number;

  constructor(private contactService: ContactService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.setContactStatusIndex();
  }

  private setContactStatusIndex() {
    if (this.contact) {
      this.contactStatusIndex = this.availableContactStatuses.findIndex(status => this.contact.status === status.value);
    }
  }

  updateStatus(index: number) {
    if (index > this.contactStatusIndex) {
      this.alertService.clear();

      let newStatus: DisplayValueMap = this.availableContactStatuses[index];
      this.contact.status = newStatus.value;

      this.contactService.update(this.contact)
        .subscribe(
          (contact: Contact) => this.handleContactSaveResponse(contact),
          err => this.handleContactSaveError(err)
        );
    }
  }

  handleContactSaveResponse(contact: Contact) {
    this.setContactStatusIndex();
    this.alertService.success("Contact status updated!");
  }

  handleContactSaveError(err: Error) {
    console.error(err);
    this.alertService.error("Problem updating contact status!");
  }
}
