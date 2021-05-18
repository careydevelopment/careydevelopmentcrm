import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService, User } from 'carey-user';
import { AlertService } from 'carey-alert';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DisplayValueMap } from '../../../models/name-value-map';
import { DisplayValueMapService } from '../../ui/service/display-map.service';
import { sources } from '../../../models/source';
import { Account } from '../models/account';
import { accountStatuses } from '../constants/account-status';
import { industries } from '../constants/industry';
import { AccountService } from '../services/account.service';


@Component({
  selector: 'app-view-accounts',
  templateUrl: './view-accounts.component.html',
  styleUrls: ['./view-accounts.component.css']
})
export class ViewAccountsComponent implements OnInit {

  displayedColumns: string[] = ['action', 'name', 'industry', 'status', 'location'];

  dataSource: MatTableDataSource<Account>;
  currentUser: User;
  dataLoading: boolean = true;

  availableSources: DisplayValueMap[] = sources;
  availableAccountStatuses: DisplayValueMap[] = accountStatuses;
  availableIndustries: DisplayValueMap[] = industries;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  statusFilter = new FormControl('');
  industryFilter = new FormControl('');

  filterValues: any = {
    status: '',
    industry: ''
  }

  constructor(private userService: UserService, private accountService: AccountService,
    private alertService: AlertService, private displayValueMapService: DisplayValueMapService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.currentUser = this.userService.user;
    this.loadAccounts();
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
    this.industryFilter.valueChanges
      .subscribe(
        industry => {
          this.filterValues.industry = industry;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
  }

  clearFilter() {
    this.industryFilter.setValue('');
    this.statusFilter.setValue('');
  }

  private createFilter(): (account: Account, filter: string) => boolean {
    let filterFunction = function (account, filter): boolean {
      let searchTerms = JSON.parse(filter);

      let qualifies: boolean = true;

      if (searchTerms.status) {
        qualifies = qualifies && (account.status && account.status.indexOf(searchTerms.status) !== -1);
      }

      if (qualifies && searchTerms.industry) {
        qualifies = qualifies && (account.industry && account.industry.indexOf(searchTerms.industry) !== -1);
      }

      return qualifies;
    }

    return filterFunction;
  }


  private loadAccounts() {
    if (this.currentUser) {
      this.accountService.fetchAllAccounts()
        .subscribe(
          (accounts: Account[]) => this.handleAccounts(accounts),
          err => this.handleAccountsError(err)
        );
    } else {
      this.alertService.error("Problem identifying user!");
      this.dataLoading = false;
    }
  }

  private handleAccounts(accounts: Account[]) {
    this.dataLoading = false;
    this.dataSource = new MatTableDataSource(accounts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.createFilter();
  }

  private handleAccountsError(err) {
    console.error(err);
    this.alertService.error("Problem loading accounts!");
  }

  editAccount(account: Account) {
    let route = '/accounts/edit-account';
    this.router.navigate([route], { queryParams: { id: account.id } });
  }

  viewAccount(account: Account) {
    let route = '/accounts/view-account';
    this.router.navigate([route], { queryParams: { id: account.id } });
  }
}
