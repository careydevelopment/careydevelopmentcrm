import { Component, OnInit } from '@angular/core';
import { DateService } from '../../../../services/date.service';
import { Deal } from '../../models/deal';
import { DealCriteria } from '../../models/deal-criteria';
import { DealService } from '../../service/deal.service';

const maxDays: number = 60;

@Component({
  selector: 'app-revenue-contribution',
  templateUrl: './revenue-contribution.component.html',
  styleUrls: ['./revenue-contribution.component.css']
})
export class RevenueContributionComponent implements OnInit {

  options: any;
  pageTitle: string = 'Revenue Contribution';
  map: Map<string, number> = new Map<string, number>();
  pageSubtitle: string = 'Next ' + maxDays + ' Days';

  constructor(private dealService: DealService, private dateService: DateService) { }

  ngOnInit(): void {
    this.loadDeals();
  }

  private getDealCriteria(): DealCriteria {
    let criteria: DealCriteria = new DealCriteria();
    criteria.userId = "6014081e221e1b534a8aa432";
    criteria.minDate = Date.now();
    criteria.maxDate = this.dateService.getDaysForwardAsNumber(maxDays);
    criteria.orderType = 'ASC';

    return criteria;
  }

  private loadDeals() {
    let criteria: DealCriteria = this.getDealCriteria();

    //console.log("Deal criteria is ", criteria);

    this.dealService.fetchDealsByCriteria(criteria).subscribe(
      (deals: Deal[]) => this.handleDealsResponse(deals),
      (err: Error) => this.handleError(err)
    );
  }

  private handleDealsResponse(deals: Deal[]) {
    deals.forEach(deal => {
      this.addDeal(deal);
    });

    //console.log("chartData is ", this.map);

    this.setOptions();
  }

  private addDeal(deal: Deal) {
    let date: string = this.dateService.getShortDateDisplay(deal.expectedClosureDate);
    let value: number = this.dealService.getAmount(deal);

    if (this.map.get(date)) {
      let currentVal: number = this.map.get(date);
      let newVal: number = currentVal + value;

      this.map.set(date, newVal);
    } else {
      let lastValue: number = Array.from(this.map.values()).pop();
      if (!lastValue) lastValue = 0;

      this.map.set(date, value + lastValue);
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
            if (value < 1000000) return '$' + (value / 1000) + 'K';
            else return '$' + (value / 1000000) + 'M';
          }
        }
      },
      series: [{
        data: Array.from(this.map.values()),
        type: 'line',
        smooth: true
      }]
    };
  }

  private handleError(err: Error) {
    console.error(err);
  }

}
