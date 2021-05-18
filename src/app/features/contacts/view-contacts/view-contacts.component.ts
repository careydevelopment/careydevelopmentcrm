import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService, User } from 'carey-user';
import { AlertService } from 'carey-alert';
import { Contact } from '../models/contact';
import { contactStatuses } from '../constants/contact-status';
import { linesOfBusiness } from '../constants/line-of-business';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DisplayValueMap } from '../../../models/name-value-map';
import { DisplayValueMapService } from '../../ui/service/display-map.service';
import { ContactService } from '../services/contact.service';
import { sources } from '../../../models/source';
import { addressTypes } from '../../../models/address-type';
import { phoneTypes } from '../../../models/phone-type';


@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.css']
})
export class ViewContactsComponent implements OnInit {

  displayedColumns: string[] = ['action', 'lastName', 'firstName', 'status', 'title', 'company'];

  dataSource: MatTableDataSource<Contact>;
  currentUser: User;
  dataLoading: boolean = true;

  availableAddressTypes: DisplayValueMap[] = addressTypes;
  availablePhoneTypes: DisplayValueMap[] = phoneTypes;
  availableContactStatuses: DisplayValueMap[] = contactStatuses;
  availableLinesOfBusiness: DisplayValueMap[] = linesOfBusiness;
  availableSources: DisplayValueMap[] = sources;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  statusFilter = new FormControl('');
  sourceFilter = new FormControl('');

  filterValues: any = {
    status: '',
    source: ''
  }

  constructor(private userService: UserService, private contactService: ContactService,
    private alertService: AlertService, private displayValueMapService: DisplayValueMapService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.currentUser = this.userService.user;
    this.loadContacts();
    this.fieldListener();
  }

  private fieldListener() {
    this.statusFilter.valueChanges
      .subscribe(
        status => {
          this.filterValues.status = status;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.sourceFilter.valueChanges
      .subscribe(
        source => {
          this.filterValues.source = source;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
  }

  clearFilter() {
    this.sourceFilter.setValue('');
    this.statusFilter.setValue('');
  }

  private createFilter(): (contact: Contact, filter: string) => boolean {
    let filterFunction = function (contact, filter): boolean {
      let searchTerms = JSON.parse(filter);

      return contact.status.indexOf(searchTerms.status) !== -1
        && contact.source.indexOf(searchTerms.source) !== -1;
    }

    return filterFunction;
  }


  private loadContacts() {
    if (this.currentUser) {
      this.contactService.fetchMyContacts()
        .subscribe(
          (contacts: Contact[]) => this.handleContacts(contacts),
          err => this.handleContactsError(err)
        );
    } else {
      this.alertService.error("Problem identifying user!");
      this.dataLoading = false;
    }
  }

  private handleContacts(contacts: Contact[]) {
    this.dataLoading = false;
    this.dataSource = new MatTableDataSource(contacts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.createFilter();
  }

  private handleContactsError(err) {
    console.error(err);
    this.alertService.error("Problem loading contacts!");
  }

  editContact(contact: Contact) {
    let route = '/contacts/edit-contact';
    this.router.navigate([route], { queryParams: { id: contact.id } });
  }

  viewContact(contact: Contact) {
    let route = '/contacts/view-contact';
    this.router.navigate([route], { queryParams: { id: contact.id } });
  }
}
