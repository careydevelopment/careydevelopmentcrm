import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService, User } from 'carey-user';
import { AlertService } from 'carey-alert';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DisplayValueMapService } from '../../ui/service/display-map.service';
import { Deal } from '../models/deal';
import { DealStage } from '../models/deal-stage';
import { DealService } from '../service/deal.service';
import { DateService } from '../../../services/date.service';
import { Account } from '../../accounts/models/account';
import { AccountLightweight } from '../models/account-lightweight';

const sortingDataAccessor = (item, property) => {
  switch (property) {
    case 'expectedClose': return item.expectedClosureDate;
    case 'contact': return item.contact.lastName;
    default: return item[property];
  }
};

interface ContactLightweight {
  firstName: string;
  lastName: string;
  id: string;
}

@Component({
  selector: 'app-view-deals',
  templateUrl: './view-deals.component.html',
  styleUrls: ['./view-deals.component.css']
})
export class ViewDealsComponent implements OnInit {

  displayedColumns: string[] = ['action', 'name', 'stage', 'expectedClose', 'contact', 'account'];

  dataSource: MatTableDataSource<Deal>;
  currentUser: User;
  dataLoading: boolean = true;

  availableDealStages: DealStage[] = [];
  availableContacts: ContactLightweight[] = [];
  availableAccounts: AccountLightweight[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  stageFilter = new FormControl('');
  contactFilter = new FormControl('');
  accountFilter = new FormControl('');

  filterValues: any = {
    stage: '',
    contact: '',
    account: ''
  }

  constructor(private userService: UserService, private dealService: DealService,
    private alertService: AlertService, private displayValueMapService: DisplayValueMapService,
    private router: Router, private dateService: DateService) {
  }

  ngOnInit(): void {
    this.currentUser = this.userService.user;
    this.loadDeals();
    this.fieldListener();
  }

  private setFilterData() {
    let tempContacts: ContactLightweight[] = [];
    let tempStages: DealStage[] = [];
    let tempAccounts: AccountLightweight[] = [];

    this.dataSource.data.forEach(deal => {
      if (deal.contact) {
        let contact = deal.contact;
        let isPresent: boolean = tempContacts.some(function (el) { return el.id === contact.id });

        if (!isPresent) {
          let contactLight: ContactLightweight = { firstName: contact.firstName, lastName: contact.lastName, id: contact.id };
          tempContacts.push(contactLight);
        }
      }

      if (deal.stage) {
        let stage = deal.stage;
        let isPresent: boolean = tempStages.some(function (el) { return el.id === stage.id });

        if (!isPresent) {
          tempStages.push(stage);
        }
      }

      if (deal.contact && deal.contact.account) {
        let account = deal.contact.account;
        let isPresent: boolean = tempStages.some(function (el) { return el.id === account.id });

        if (!isPresent) {
          tempAccounts.push(account);
        }
      }
    });

    this.availableContacts = tempContacts.sort((a, b) => a.lastName > b.lastName ? 1 : a.lastName === b.lastName ? 0 : -1);
    this.availableDealStages = tempStages.sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1);
    this.availableAccounts = tempAccounts.sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1);
  }

  private fieldListener() {
    this.stageFilter.valueChanges
      .subscribe(
        stage => {
          this.filterValues.stage = stage;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
    );

    this.contactFilter.valueChanges
      .subscribe(
        contact => {
          this.filterValues.contact = contact;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
    );

    this.accountFilter.valueChanges
      .subscribe(
        account => {
          this.filterValues.account = account;
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
    );
  }

  clearFilter() {
    this.stageFilter.setValue('');
    this.contactFilter.setValue('');
    this.accountFilter.setValue('');
  }

  private createFilter(): (deal: Deal, filter: string) => boolean {
    let filterFunction = function (deal, filter): boolean {
      let searchTerms = JSON.parse(filter);
      let qualifies: boolean = true;

      if (searchTerms.stage) {
        qualifies = (deal.stage && deal.stage.name && deal.stage.name.indexOf(searchTerms.stage) !== -1);
      }

      if (searchTerms.contact) {
        qualifies = qualifies && (deal.contact && deal.contact.id && deal.contact.id.indexOf(searchTerms.contact) !== -1);
      }

      if (searchTerms.account) {
        qualifies = qualifies && (deal.contact && deal.contact.account && deal.contact.account.id.indexOf(searchTerms.account) !== -1);
      }

      return qualifies;
    }

    return filterFunction;
  }


  private loadDeals() {
    if (this.currentUser) {
      this.dealService.fetchDealsByUserId(this.currentUser.id)
        .subscribe(
          (deals: Deal[]) => this.handleDeals(deals),
          err => this.handleDealsError(err)
        );
    } else {
      this.alertService.error("Problem identifying user!");
      this.dataLoading = false;
    }
  }

  private handleDeals(deals: Deal[]) {
    this.dataLoading = false;
    this.dataSource = new MatTableDataSource(deals);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = sortingDataAccessor;
    this.dataSource.sort = this.sort;
    this.setFilterData();
    this.dataSource.filterPredicate = this.createFilter();
  }

  private handleDealsError(err) {
    console.error(err);
    this.alertService.error("Problem loading deals!");
  }

  editDeal(deal: Deal) {
    let route = '/deals/edit-deal';
    this.router.navigate([route], { queryParams: { dealId: deal.id } });
  }

  viewDeal(deal: Deal) {
    let route = '/deals/view-deal';
    this.router.navigate([route], { queryParams: { dealId: deal.id } });
  }
}
