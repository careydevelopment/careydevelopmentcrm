import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../models/user';
import { AlertService } from '../../../ui/alert/alert.service';
import { ContactService } from '../../service/contact.service';
import { UserService } from '../../service/user.service';
import { Contact } from '../models/contact';
import { DropdownOption } from '../../ui/model/dropdown-option';
import { addressTypes } from '../constants/address-type';
import { contactStatuses } from '../constants/contact-status';
import { linesOfBusiness } from '../constants/line-of-business';
import { phoneTypes } from '../constants/phone-type';
import { sources } from '../constants/source';
import { DropdownService } from '../../ui/service/dropdown.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.css']
})
export class ViewContactsComponent implements OnInit {

  displayedColumns: string[] = ['lastName', 'firstName', 'status', 'title', 'company', 'source'];
  dataSource: MatTableDataSource<Contact>;
  currentUser: User;
  dataLoading: boolean = true;

  availableAddressTypes: DropdownOption[] = addressTypes;
  availablePhoneTypes: DropdownOption[] = phoneTypes;
  availableContactStatuses: DropdownOption[] = contactStatuses;
  availableLinesOfBusiness: DropdownOption[] = linesOfBusiness;
  availableSources: DropdownOption[] = sources;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  statusFilter = new FormControl('');
  sourceFilter = new FormControl('');

  filterValues: any = {
    status: '',
    source: ''
  }

  constructor(private userService: UserService, private contactService: ContactService,
    private alertService: AlertService, private dropdownService: DropdownService) {
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
          this.filterValues.status = status ? status : "";
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.sourceFilter.valueChanges
      .subscribe(
        source => {
          this.filterValues.source = source ? source : "";
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
  }

  clearFilter() {
    this.sourceFilter.setValue('');
    this.statusFilter.setValue('');
  }

  private createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      
      return data.status.indexOf(searchTerms.status) !== -1
        && data.source.toString().indexOf(searchTerms.source) !== -1;
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
}
