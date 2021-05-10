import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from 'carey-alert';
import { HttpErrorResponse } from '@angular/common/http';
import { Deal } from '../models/deal';
import { BreadcrumbService } from '../../../ui/breadcrumb/breadcrumb.service';
import { DealService } from '../service/deal.service';
import { DateService } from '../../../services/date.service';
import { DealStage } from '../models/deal-stage';
import { ContactService } from '../../contacts/services/contact.service';
import { ActivitySearchCriteria } from '../../activities/models/activity-search-criteria';

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
  prohibitedEdit: boolean = false;
  saving: boolean = false;

  wonButtonColor: string = 'green';
  lostButtonColor: string = 'red';

  recentActivitiesCriteria: ActivitySearchCriteria = new ActivitySearchCriteria();
  recentActivitiesTitle: string = "Recent Activities";
  constructor(private route: ActivatedRoute,
    private alertService: AlertService, private router: Router,
    private dealService: DealService, private breadcrumbService: BreadcrumbService,
    private dateService: DateService, private contactService: ContactService) { }

  ngOnInit(): void {
    this.loadDeal();
  }

  private setCriteria() {
    this.setRecentActivitiesCriteria();
    this.loading = false;
  }

  private setRecentActivitiesCriteria() {
    this.recentActivitiesCriteria.dealId = this.deal.id;
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

    //console.log("Deal is ", deal);

    this.loadSupplementalData();
  }

  private loadSupplementalData() {
    this.closureDate = this.dateService.getShortDateDisplay(this.deal.expectedClosureDate);
    this.dealAmount = this.dealService.getAmount(this.deal);
    this.setCriteria();
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

  saveDeal(stage: string) {
    this.saving = true;
    this.dealService.fetchDealStagesBySalesType('INBOUND').subscribe(
      (stages: DealStage[]) => this.handleDealStagesResponse(stages, stage),
      (err: Error) => this.handleError(err)
    );
  }

  private handleDealStagesResponse(stages: DealStage[], newStageName: string) {
    let newStage: DealStage = stages.find(st => st.name === newStageName);

    if (newStage) {
      this.deal.stage = newStage;

      this.dealService.updateDeal(this.deal).subscribe(
        (deal: Deal) => this.handleDealUpdateResponse(deal),
        (err: Error) => this.handleError(err)
      );

      if (this.deal.stage.name == 'Won') {
        this.contactService.convertContactToCustomer(this.deal.contact.id);
      }
    } else {
      this.alertService.error("Problem finding stage by name!");
    }
  }

  private handleDealUpdateResponse(deal: Deal) {
    //this.alertService.success("Deal successfully updated!");
    this.saving = false;
  }

  private handleError(err: Error) {
    console.error(err);
    this.alertService.error("Something went wrong. Please call support.");
    this.saving = false;
  }
}
