import { Component, OnInit } from '@angular/core';
import { Deal } from '../../models/deal';
import { DealCriteria } from '../../models/deal-criteria';
import { DealService } from '../../service/deal.service';

@Component({
  selector: 'app-deal-share-by-contact',
  templateUrl: './deal-share-by-contact.component.html',
  styleUrls: ['./deal-share-by-contact.component.css']
})
export class DealShareByContactComponent implements OnInit {

  options: any;
  pageTitle: string = 'Deal Share by Contact';
  chartData: any[] = [];

  constructor(private dealService: DealService) { }

  ngOnInit(): void {
    this.loadDeals();
  }

  private getDealCriteria(): DealCriteria {
    let criteria: DealCriteria = new DealCriteria();
    criteria.userId = "6014081e221e1b534a8aa432";
    
    return criteria;
  }

  private loadDeals() {
    let criteria: DealCriteria = this.getDealCriteria();

    console.log("Deal criteria is ", criteria);

    this.dealService.fetchDealsByCriteria(criteria).subscribe(
      (deals: Deal[]) => this.handleDealsResponse(deals),
      (err: Error) => this.handleError(err)
    );
  }

  private handleDealsResponse(deals: Deal[]) {
    deals.forEach(deal => {
      this.addDeal(deal);
    });

    console.log("chartData is ",this.chartData);

    this.setOptions();
  }

  private addDeal(deal: Deal) {
    let value: number = this.dealService.getAmount(deal);
    let contactName: string = deal.contact.firstName + ' ' + deal.contact.lastName;

    let dataPoint: any = this.chartData.find(dp => dp.name === contactName);

    if (dataPoint) {
      let amount = this.dealService.getAmount(deal);
      dataPoint.value = value + amount;
    } else {
      dataPoint = {};
      dataPoint.value = value;
      dataPoint.name = contactName;

      this.chartData.push(dataPoint);
    }
  }

  private setOptions() {
    this.options = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: this.chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
}

  private handleError(err: Error) {
    console.error(err);
  }
}
