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
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, switchMap, tap } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/table';


@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.css']
})
export class ViewContactsComponent implements OnInit {

  displayedColumns: string[] = ['action', 'lastName', 'firstName', 'status', 'title', 'account'];

  currentUser: User;

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

  dataSource$: Observable<MatTableDataSource<Contact>>;
  localDataSource: MatTableDataSource<Contact>;

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
          this.updateFilter();
        }
    )

    this.sourceFilter.valueChanges
      .subscribe(
        source => {
          this.filterValues.source = source;
          this.updateFilter();
        }
    )
  }

  private updateFilter() {
    this.localDataSource.filter = JSON.stringify(this.filterValues);
    this.dataSource$ = of(this.localDataSource);
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
      this.dataSource$ = this.contactService.fetchMyContacts()
        .pipe(
          switchMap(contacts => this.handleContacts(contacts)),
          catchError(err => this.handleContactsError(err))
        );
    } else {
      this.alertService.error("Problem identifying user!");
    }
  }

  private handleContacts(contacts: Contact[]): Observable<MatTableDataSource<Contact>> {
    this.localDataSource = this.setUpDataSource(contacts);
    return of(this.localDataSource);
  }

  private setUpDataSource(contacts: Contact[]): MatTableDataSource<Contact> {
    let dataSource: MatTableDataSource<Contact> = new MatTableDataSource(contacts);
    dataSource.paginator = this.paginator;
    dataSource.sort = this.sort;
    dataSource.filterPredicate = this.createFilter();

    return dataSource;
  }

  private handleContactsError(err): Observable<MatTableDataSource<Contact>> {
    console.error(err);
    this.alertService.error("Problem loading contacts!");

    this.localDataSource = this.setUpDataSource([]);
    return of(this.localDataSource);
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
