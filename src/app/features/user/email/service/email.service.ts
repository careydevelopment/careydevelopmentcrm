import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Email } from '../models/email';
import { Observable } from 'rxjs';

const baseUrl: string = environment.baseEmailServiceUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};


@Injectable()
export class EmailService {

  constructor(private http: HttpClient) { }

  fetchInbox(): Observable<Email[]> {
    let url = `${baseUrl}/email/inbox`;
    console.log("Fetch inbox URL is " + url);

    return this.http.get<Email[]>(url);
  }

  getDisplayableFrom(from: string): string {
    let cleanText: string = from.replace(/<\/?[^>]+(>|$)/g, "");

    if (cleanText.length > 20) {
      cleanText = cleanText.substring(0, 21) + '...';
    }

    return cleanText;
  }
}
