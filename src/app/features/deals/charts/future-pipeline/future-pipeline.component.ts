import { Component, OnInit } from '@angular/core';
import { DateService } from '../../../../services/date.service';
import { UserService } from '../../../service/user.service';
import { Deal } from '../../models/deal';
import { DealService } from '../../service/deal.service';

@Component({
  selector: 'app-future-pipeline',
  templateUrl: './future-pipeline.component.html',
  styleUrls: ['./future-pipeline.component.css']
})
export class FuturePipelineComponent implements OnInit {

  options: any;
  map: Map<string, number> = new Map < string, number>();

  constructor(private dealService: DealService, private userService: UserService,
    private dateService: DateService) { }

  ngOnInit(): void {
    this.loadDeals();
  }

  private loadDeals() {
    this.dealService.fetchDealsByUserId("6014081e221e1b534a8aa432", "ASC").subscribe(
      (deals: Deal[]) => this.handleDealsResponse(deals),
      (err: Error) => this.handleError(err)
    );
  }

  private handleDealsResponse(deals: Deal[]) {
    console.log(deals);
    deals.forEach(deal => {
      this.addDealValue(deal);
    });

    console.log(this.map);

    this.setOptions();
  }

  private addDealValue(deal: Deal) {
    let date: string = this.dateService.getShortDateDisplay(deal.expectedClosureDate);
    let value: number = this.dealService.getAmount(deal);

    if (this.map.get(date)) {
      let currentVal: number = this.map.get(date);
      let newVal: number = currentVal + value;

      this.map.set(date, newVal);
    } else {
      this.map.set(date, value);
    }
  }

  private setOptions() {
    this.options = {
      xAxis: {
        type: 'category',
        data: Array.from(this.map.keys())
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: Array.from(this.map.values()),
        type: 'bar'
      }]
    };
  }

  private handleError(err: Error) {
    console.error(err);
  }
}
