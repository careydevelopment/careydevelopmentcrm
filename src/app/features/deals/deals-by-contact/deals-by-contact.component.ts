import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Deal } from '../models/deal';
import { DealService } from '../service/deal.service';
import { DateService } from '../../../services/date.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deals-by-contact',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './deals-by-contact.component.html',
  styleUrls: ['./deals-by-contact.component.css']
})
export class DealsByContactComponent implements OnInit {

  @Input() contactId: string;
  deals: Deal[];
  loading: boolean = true;
  errorLoading: boolean = false;

  constructor(private dealService: DealService, private dateService: DateService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadDeals();
  }

  private loadDeals() {
    this.dealService.fetchDealsByContactId(this.contactId).subscribe(
      (deals: Deal[]) => this.handleFetchDealsResponse(deals),
      err => this.handleFetchDealsError(err)
    );
  }

  private handleFetchDealsResponse(deals: Deal[]) {
    this.deals = deals;
    this.loading = false;
  }

  private handleFetchDealsError(err: Error) {
    this.errorLoading = true;
    this.loading = false;

    console.error(err);
  }

  editDeal(dealId: string) {
    let route = '/deals/edit-deal';
    this.router.navigate([route], { queryParams: { dealId: dealId } });
  }

  viewDeal(dealId: string) {
    let route = '/deals/view-deal';
    this.router.navigate([route], { queryParams: { dealId: dealId } });
  }
}
