import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from 'carey-alert';
import { HttpErrorResponse } from '@angular/common/http';
import { Deal } from '../models/deal';
import { BreadcrumbService } from '../../../ui/breadcrumb/breadcrumb.service';
import { DealService } from '../service/deal.service';

@Component({
  selector: 'app-edit-deal',
  templateUrl: './edit-deal.component.html',
  styleUrls: ['./edit-deal.component.css']
})
export class EditDealComponent implements OnInit {

  loading: boolean = true;
  deal: Deal;

  constructor(private route: ActivatedRoute,
    private alertService: AlertService, private router: Router,
    private dealService: DealService, private breadcrumbService: BreadcrumbService) { }

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
    this.loading = false;
    this.breadcrumbService.updateBreadcrumb("Edit " + this.deal.name);
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
}
