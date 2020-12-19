import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../models/user';
import { AlertService } from '../../../ui/alert/alert.service';
import { ContactService } from '../../service/contact.service';
import { UserService } from '../../service/user.service';
import { Contact } from '../models/contact';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
  'aqua', 'blue', 'navy', 'black', 'gray'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];


@Component({
  selector: 'app-view-contacts',
  templateUrl: './view-contacts.component.html',
  styleUrls: ['./view-contacts.component.css']
})
export class ViewContactsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['lastName', 'firstName', 'status', 'title', 'company', 'source'];
  dataSource: MatTableDataSource<Contact>;
  currentUser: User;
  dataLoading: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService, private contactService: ContactService,
    private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.currentUser = this.userService.user;
    this.loadContacts();
  }

  ngAfterViewInit() {
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
    }
  }

  private handleContacts(contacts: Contact[]) {
    this.dataLoading = false;
    console.log(contacts);
    this.dataSource = new MatTableDataSource(contacts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private handleContactsError(err) {
    console.error(err);
    this.alertService.error("Problem loading contacts!");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

/*function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };

}*/
