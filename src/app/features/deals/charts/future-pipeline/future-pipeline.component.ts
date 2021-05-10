import { Component, OnInit } from '@angular/core';
import { DateService } from '../../../../services/date.service';
import { UserService } from 'carey-user';
import { Deal } from '../../models/deal';
import { DealCriteria } from '../../models/deal-criteria';
import { DealService } from '../../service/deal.service';

const maxResults: number = 6;
const maxDays: number = 60;

@Component({
  selector: 'app-future-pipeline',
  templateUrl: './future-pipeline.component.html',
  styleUrls: ['./future-pipeline.component.css']
})
export class FuturePipelineComponent implements OnInit {

  options: any;
  map: Map<string, number> = new Map<string, number>();
  pageTitle: string = 'Upcoming Deal Closures';
  pageSubtitle: string = 'Next ' + maxDays + ' Days';

  constructor(private dealService: DealService, private userService: UserService,
    private dateService: DateService) { }

  ngOnInit(): void {
    this.loadDeals();
  }

  private getDealCriteria(): DealCriteria {
    let criteria: DealCriteria = new DealCriteria();
    criteria.userId = "6014081e221e1b534a8aa432";
    criteria.orderType = "ASC";
    criteria.maxResults = maxResults;
    criteria.minDate = Date.now();
    criteria.maxDate = this.dateService.getDaysForwardAsNumber(maxDays);

    return criteria;
  }

  private loadDeals() {
    let criteria: DealCriteria = this.getDealCriteria();

    this.dealService.fetchDealsByCriteria(criteria).subscribe(
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
      grid: {
        //prevents cutoff of y-axis labels
        left: '15%'
      },
      xAxis: {
        type: 'category',
        data: Array.from(this.map.keys())
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function (value) {
            return '$' + (value / 1000) + 'K';
          }
        }
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
