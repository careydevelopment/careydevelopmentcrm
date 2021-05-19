import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Account } from '../../accounts/models/account';


const baseUrl: string = environment.baseCustomerServiceUrl;

@Injectable({ providedIn: 'root' })
export class AccountService {

  constructor(private http: HttpClient) { }

  fetchAllAccounts(): Observable<Account[]> {
    let url = `${baseUrl}/accounts`;
    console.log("Fetch all accounts URL is " + url);

    return this.http.get<Account[]>(url);
  }

  fetchById(id: string): Observable<Account> {
    let url = `${baseUrl}/accounts/${id}`;
    console.log("Fetch account URL is " + url);

    return this.http.get<Account>(url);
  }

  createAccount(account: Account): Observable<Account> {
    let url = `${baseUrl}/accounts`;
    console.log("Create account URL is " + url);

    return this.http.post<Account>(url, account);
  }

  updateAccount(account: Account): Observable<Account> {
    let url = `${baseUrl}/accounts/${account.id}`;
    console.log("Update account URL is " + url);

    return this.http.put<Account>(url, account);
  }
}
