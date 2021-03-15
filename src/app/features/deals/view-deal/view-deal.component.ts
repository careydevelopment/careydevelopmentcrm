import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from '../../../ui/alert/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Deal } from '../models/deal';
import { BreadcrumbService } from '../../../ui/breadcrumb/breadcrumb.service';
import { DealService } from '../service/deal.service';
import { DateService } from '../../../services/date.service';

@Component({
  selector: 'app-view-deal',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './view-deal.component.html',
  styleUrls: ['./view-deal.component.css']
})
export class ViewDealComponent implements OnInit {

  loading: boolean = true;
  deal: Deal;
  pageTitle: string = 'View Deal';
  dealAmount: number = 0;
  closureDate: string = '';

  constructor(private route: ActivatedRoute,
    private alertService: AlertService, private router: Router,
    private dealService: DealService, private breadcrumbService: BreadcrumbService,
    private dateService: DateService) { }

  ngOnInit(): void {
    this.loadDeal();
  }

  private loadDeal() {
    let deal$ = this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) =>
        this.dealService.fetchDealById(params.get('dealId')))
    );

    deal$.subscribe(
      (deal: Deal) => this.handleDealResponse(deal),
      err => this.handleDealError(err)
    );
  }

  private handleDealResponse(deal: Deal) {
    this.deal = deal;
    this.pageTitle = this.deal.name;
    this.breadcrumbService.updateBreadcrumb('View ' + this.pageTitle);

    this.loadSupplementalData();
  }

  private loadSupplementalData() {
    this.closureDate = this.dateService.getShortDateDisplay(this.deal.expectedClosureDate);
    this.dealAmount = this.dealService.getAmount(this.deal);

    this.loading = false;
  }

  private handleDealError(err: Error) {
    this.loading = false;
    console.error(err);

    let alertMessage: string = 'Problem loading deal';

    if (err instanceof HttpErrorResponse) {
      if (err.status) {
        if (err.status == 404) {
          alertMessage = 'Deal with that ID does not exist';
        }
      }
    }

    this.alertService.error(alertMessage);
  }

  editDeal() {
    let route = '/deals/edit-deal';
    this.router.navigate([route], { queryParams: { dealId: this.deal.id } });
  }
}
