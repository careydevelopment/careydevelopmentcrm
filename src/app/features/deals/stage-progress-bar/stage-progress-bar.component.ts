import { Component, OnInit, Input } from '@angular/core';
import { AlertService } from 'carey-alert';
import { DealStage } from '../models/deal-stage';
import { Deal } from '../models/deal';
import { DealService } from '../service/deal.service';

@Component({
  selector: 'app-stage-progress-bar',
  templateUrl: './stage-progress-bar.component.html',
  styleUrls: ['./stage-progress-bar.component.css']
})
export class StageProgressBarComponent implements OnInit {

  @Input() deal: Deal;

  availableDealStages: DealStage[];
  dealStageIndex: number;

  constructor(private dealService: DealService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.loadDealStages();
  }

  private loadDealStages() {
    this.dealService.fetchDealStagesBySalesType('INBOUND').subscribe(
      (stages: DealStage[]) => this.handleDealStages(stages),
      (err: Error) => this.handleDealStagesError(err)
    );
  }

  private handleDealStages(stages: DealStage[]) {
    console.log("deal stages is ", stages);
    this.availableDealStages = this.dealService.removeClosingStages(stages);
    this.setDealStageIndex();
  }

  private handleDealStagesError(err: Error) {
    console.error(err);
    this.alertService.error("Problem loading deal stages!");
  }

  private setDealStageIndex() {
    if (this.deal && this.availableDealStages && this.availableDealStages.length > 0) {
      this.dealStageIndex = this.availableDealStages.findIndex(stage => this.deal.stage.id === stage.id);
    }
  }

  updateStage(index: number) {
    if (index > this.dealStageIndex) {
      this.alertService.clear();

      let newStage: DealStage = this.availableDealStages[index];
      this.deal.stage = newStage;

      this.dealService.updateDeal(this.deal)
        .subscribe(
          (deal: Deal) => this.handleDealSaveResponse(deal),
          err => this.handleDealSaveError(err)
        );
    }
  }

  handleDealSaveResponse(deal: Deal) {
    this.setDealStageIndex();
    this.alertService.success("Deal stage updated!");
  }

  handleDealSaveError(err: Error) {
    console.error(err);
    this.alertService.error("Problem updating deal stage!");
  }

}
