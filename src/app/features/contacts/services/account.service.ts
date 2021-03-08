import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Account } from '../models/account';


const baseUrl: string = environment.baseCustomerServiceUrl;

@Injectable({ providedIn: 'root' })
export class AccountService {

  constructor(private http: HttpClient) { }

  fetchAllAccounts(): Observable<Account[]> {
    let url = `${baseUrl}/accounts`;
    console.log("Fetch all accounts URL is " + url);

    return this.http.get<Account[]>(url);
  }
}
