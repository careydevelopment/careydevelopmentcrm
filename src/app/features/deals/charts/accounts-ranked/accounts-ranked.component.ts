import { Component, OnInit } from '@angular/core';
import { DateService } from '../../../../services/date.service';
import { UserService } from 'carey-user';
import { Deal } from '../../models/deal';
import { DealCriteria } from '../../models/deal-criteria';
import { DealService } from '../../service/deal.service';

@Component({
  selector: 'app-accounts-ranked',
  templateUrl: './accounts-ranked.component.html',
  styleUrls: ['./accounts-ranked.component.css']
})
export class AccountsRankedComponent implements OnInit {

  options: any;
  map: Map<string, number> = new Map<string, number>();
  pageTitle: string = 'Accounts Ranked';
  pageSubtitle: string = 'By Deal Values';
  dimensions: string[] = ['account', 'value'];
  dataset: Array<Array<string | number>> = [];

  constructor(private dealService: DealService, private userService: UserService,
    private dateService: DateService) { }

  ngOnInit(): void {
    this.loadDeals();
  }

  private getDealCriteria(): DealCriteria {
    let criteria: DealCriteria = new DealCriteria();
    criteria.userId = "6014081e221e1b534a8aa432";
    //criteria.orderType = "ASC";
    //criteria.maxResults = maxResults;
    //criteria.minDate = Date.now();
    //criteria.maxDate = this.dateService.getDaysForwardAsNumber(maxDays);

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
    //console.log(deals);
    deals.forEach(deal => {
      this.addDealValue(deal);
    });

    //console.log(this.map);

    this.setOptions();
  }

  private addDealValue(deal: Deal) {
    let account: string = deal.contact.account.name;
    let value: number = this.dealService.getAmount(deal);

    let foundAccount: Array<string | number> = this.dataset.find(data => data[0] === account);

    if (foundAccount) {
      let currentVal: number = +foundAccount[1];
      let newVal: number = currentVal + value;
      foundAccount[1] = newVal;
    } else {
      let accountData: Array<string | number> = [account, value];
      this.dataset.push(accountData);
    }
  }

  private setOptions() {
    this.options = {
      grid: {
        //prevents cutoff of y-axis labels
        left: '15%'
      },
      dataset: [{
        dimensions: ['account', 'value'],
        source: this.dataset
      }, {
        transform: {
          type: 'sort',
          config: { dimension: 'value', order: 'desc' }
        }
      }],
      xAxis: {
        type: 'category',
        axisLabel: { interval: 0, rotate: 30 },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function (value) {
            return '$' + (value / 1000) + 'K';
          }
        }
      },
      series: {
        type: 'bar',
        encode: { x: 'account', y: 'value' },
        datasetIndex: 1
      }
    };
  }

  private handleError(err: Error) {
    console.error(err);
  }

}
