import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Email } from '../models/email';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

const baseUrl: string = environment.baseEmailServiceUrl;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};


@Injectable()
export class EmailService {

  private emailMessagesRequest$: Observable<Email[]> = null;

  constructor(private http: HttpClient) { }

  fetchInbox(refresh?: boolean): Observable<Email[]> {
    let url = `${baseUrl}/email/inbox`; 
    console.log("Fetch inbox URL is " + url);

    if (!this.emailMessagesRequest$ || refresh) {
      this.emailMessagesRequest$ = this.http.get<Email[]>(url).pipe(
        shareReplay(1)
      );
    }

    return this.emailMessagesRequest$;
  }

  fetchMessageById(id: string): Observable<Email> {
    let url = `${baseUrl}/email/messages/${id}`;
    console.log("Fetch message URL is " + url);

    return this.http.get<Email>(url);
  }

  getDisplayableFrom(from: string): string {
    let cleanText: string = from.replace(/<\/?[^>]+(>|$)/g, "");

    if (cleanText.length > 20) {
      cleanText = cleanText.substring(0, 21) + '...';
    }

    return cleanText;
  }
}
