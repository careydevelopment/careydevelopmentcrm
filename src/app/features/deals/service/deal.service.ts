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


const baseUrl: string = environment.baseCrmServiceUrl;

@Injectable({ providedIn: 'root' })
export class DealService {

  constructor(private http: HttpClient, private currencyService: CurrencyService) { }

  fetchAllDealStages(): Observable<DealStage[]> {
    let url = `${baseUrl}/dealstages`;
    console.log("Fetch all deal stages URL is " + url);

    return this.http.get<DealStage[]>(url);
  }

  fetchDealsByContactId(contactId: string): Observable<Deal[]> {
    let orderBy = 'startDate';
    let orderType = 'DESC';

    let url = `${baseUrl}/deals/search?contactId=${contactId}&orderBy=${orderBy}&orderType=${orderType}`;
    console.log("Fetch deals by contact URL is " + url);

    return this.http.get<Deal[]>(url);
  }

  createDeal(deal: Deal): Observable<Deal> {
    let url = `${baseUrl}/deals`;
    return this.http.post<Deal>(url, deal);
  }

  updateDeal(deal: Deal): Observable<Deal> {
    let url = `${baseUrl}/deals/${deal.id}`;
    return this.http.put<Deal>(url, deal);
  }

  public getAmount(deal: Deal) {
    let amount: number = 0;

    if (deal.product && deal.product.prices && deal.contact && deal.contact.account) {
      let price: Price = this.getPriceByAccount(deal.product, deal.contact.account);

      if (price) {
        amount = price.amount * deal.units;
      }
    } else {
      console.error("Missing key data", deal);
    }

    return this.currencyService.formatForDollars(amount);
  }

  public getPriceByAccount(product: Product, account: AccountLightweight) {
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
}
