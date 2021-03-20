import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Deal } from '../models/deal';
import { Product } from '../models/product';
import { DealStage } from '../models/deal-stage';
import { Price } from '../models/price';
import { AccountLightweight } from '../models/account-lightweight';
import { CurrencyService } from '../../../services/currency.service';
import { DisplayValueMapService } from '../../ui/service/display-map.service';
import { DisplayValueMap } from '../../../models/name-value-map';
import { unitTypes } from '../constants/unit-type';
import { priceTypes } from '../constants/price-type';
import { SalesType } from '../models/sales-type';
import { switchMap } from 'rxjs/operators';
import { DateService } from '../../../services/date.service';
import { DealCriteria } from '../models/deal-criteria';


const baseUrl: string = environment.baseCrmServiceUrl;

@Injectable({ providedIn: 'root' })
export class DealService {

  allUnitTypes: DisplayValueMap[] = unitTypes;
  allPriceTypes: DisplayValueMap[] = priceTypes;

  constructor(private http: HttpClient, private currencyService: CurrencyService,
    private displayValueMapService: DisplayValueMapService, private dateService: DateService) { }

  removeClosingStages(dealStages: DealStage[]): DealStage[] {
    let stages: DealStage[];

    if (dealStages) {
      stages = dealStages.filter(stage => stage.name != 'Won' && stage.name != 'Lost');
    }

    return stages;
  }

  fetchAllSalesTypes(): Observable<SalesType[]> {
    let url = `${baseUrl}/salestypes`;
    console.log("Fetch all sales types URL is " + url);

    return this.http.get<SalesType[]>(url);
  }

  fetchDealStagesBySalesType(salesType: string): Observable<DealStage[]> {
    let url = `${baseUrl}/dealstages?salesType=${salesType}`;
    console.log("Fetch all deal stages URL is " + url);

    return this.http.get<DealStage[]>(url);
  }

  fetchDealsByContactId(contactId: string, orderType?: string): Observable<Deal[]> {
    let orderBy = 'startDate';
    if (!orderType) orderType = 'DESC';

    let url = `${baseUrl}/deals/search?contactId=${contactId}&orderBy=${orderBy}&orderType=${orderType}`;
    console.log("Fetch deals by contact URL is " + url);

    return this.http.get<Deal[]>(url);
  }

  fetchDealsByCriteria(criteria: DealCriteria): Observable<Deal[]> {
    let url = `${baseUrl}/deals/search?salesOwnerId=${criteria.userId}&orderBy=${criteria.orderBy}&`
      + `orderType=${criteria.orderType}&minDate=${criteria.minDate}&maxDate=${criteria.maxDate}&`
      + `maxResults=${criteria.maxResults}`;

    console.log("Fetch deals by user URL is " + url);

    return this.http.get<Deal[]>(url);
  }

  fetchDealsByUserId(userId: string): Observable<Deal[]> {
    let orderBy = 'expectedClosureDate';
    let orderType = 'DESC';

    let url = `${baseUrl}/deals/search?salesOwnerId=${userId}&orderBy=${orderBy}&orderType=${orderType}`;
    console.log("Fetch deals by user URL is " + url);

    return this.http.get<Deal[]>(url);
  }

  fetchDealById(id: string): Observable<Deal> {
    let url = `${baseUrl}/deals/${id}`;
    console.log("Fetch deal by id URL is " + url);

    return this.http.get<Deal>(url);
  }

  createDeal(deal: Deal): Observable<Deal> {
    let url = `${baseUrl}/deals`;
    return this.http.post<Deal>(url, deal);
  }

  updateDeal(deal: Deal): Observable<Deal> {
    let url = `${baseUrl}/deals/${deal.id}`;
    return this.http.put<Deal>(url, deal);
  }

  getAmount(deal: Deal): number {
    let amount: number = 0;

    if (deal.product && deal.product.prices && deal.contact && deal.contact.account) {
      let price: Price = this.getPriceByAccount(deal.product, deal.contact.account);

      if (price) {
        if (price.priceType == 'PER_UNIT') {
          amount = price.amount * deal.units;
        } else {
          amount = price.amount;
        }
      }
    } else {
      console.error("Missing key data", deal);
    }

    return this.currencyService.formatForDollars(amount);
  }

  getPriceByAccount(product: Product, account: AccountLightweight): Price {
    let price: Price = null;

    if (product && product.prices && account) {
      let prices: Price[] = product.prices;

      //hardcoding to US for now
      account.country = 'US';

      price = prices.find(p => p.currencyType === account.country);
    } else {
      console.error("Missing key data", price, account);
    }

    return price;
  }

  getPriceDisplayByAccount(product: Product, account: AccountLightweight): string {
    let amount: string = '';
    let perUnit: string = '';

    let price: Price = this.getPriceByAccount(product, account);
    amount = '' + this.currencyService.formatForDollars(price.amount);

    if (price.priceType) {
      if (price.priceType == 'PER_UNIT') {
        if (price.unitType) {
          perUnit = ' per ' + this.displayValueMapService.getDisplay(price.unitType, this.allUnitTypes);
        }
      } else if (price.priceType == 'FLAT_RATE') {
        perUnit = ' Flat Rate';
      } else if (price.priceType == 'SINGLE_ITEM') {
        perUnit = ' Each';
      }
    }

    let amountDisplay: string = `$${amount}${perUnit}`;

    return amountDisplay;
  }


  getAmountByAccount(product: Product, account: AccountLightweight, units: number): number {
    let amount: number = 0;

    let price: Price = this.getPriceByAccount(product, account);

    if (price.priceType) {
      if (price.priceType == 'PER_UNIT' || price.priceType == 'SINGLE_ITEM') {
        if (price.unitType) {
          amount = units * price.amount;
        }
      } else if (price.priceType == 'FLAT_RATE') {
        amount = price.amount;
      } 
    }

    return this.currencyService.formatForDollars(amount);
  }
}
