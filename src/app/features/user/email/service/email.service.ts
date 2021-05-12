import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Email } from '../models/email';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { TokenRequest } from '../models/token-request';
import { User } from 'carey-user';
import { EmailIntegration } from '../models/email-integration';
import { AuthenticationService } from 'carey-auth';

const baseUrl: string = environment.baseEmailServiceUrl;
const gmailRedirectUrl: string = environment.gmailRedirectUrl;

const textHeaders = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

const replyToHtmlSeparator: string = '<br/><br/><br/>-----<br/><br/>';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private emailMessagesRequest$: Observable<Email[]> = null;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  updateUserEmailChoice(user: User, choice: string): Observable<any> {
    let url = `${baseUrl}/user/${user.id}`;
    let emailIntegration = { integrationType: choice } as EmailIntegration;

    return this.http.patch(url, emailIntegration);
  }

  getGoogleAuthCodeFlowUrl(): Observable<string> {
    let url = `${baseUrl}/email/authorizationCode?redirectUrl=${gmailRedirectUrl}`;
    return this.http.get(url, { headers: textHeaders, responseType: 'text' });
  }

  fetchToken(code: string): Observable<any> {
    console.log("code is " + code);
    let tokenRequest = { code: code, redirectUrl: gmailRedirectUrl } as TokenRequest;
    let url = `${baseUrl}/email/token`;
    console.log("tokenrequest is ", tokenRequest);
    return this.http.post(url, tokenRequest, { responseType: 'text' });
  }

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

  sendEmail(email: Email): Observable<Email> {
    let url = `${baseUrl}/email/messages`;
    console.log("Send email URL is " + url);

    return this.http.post<Email>(url, email);
  }

  getEmailHistory(replyToEmail: Email): string {
    let emailHistory: string = '';

    if (replyToEmail) {
      if (replyToEmail.html) {
        emailHistory = replyToHtmlSeparator + replyToEmail.html;
        console.log(replyToEmail.html);
      } else {
        emailHistory = replyToHtmlSeparator + replyToEmail.plainText;
      }
    }

    return emailHistory;
  }

  getEmailAddressFromString(emailAddress: string): string {
    let justEmail: string = emailAddress;

    if (emailAddress && emailAddress.indexOf("<") > -1) {
      let regex = /<(.*)>/g;
      let matches = regex.exec(emailAddress);

      if (matches.length > 0) justEmail = matches[1];
    }

    return justEmail;
  }

  getReplySubject(replyToEmail: Email): string {
    let subject: string = '';

    if (replyToEmail && replyToEmail.subject) {
      let oldSubject: string = replyToEmail.subject;

      if (!oldSubject.toLowerCase().startsWith('re:')) {
        subject = 'Re: ' + oldSubject;
      }
    }

    return subject;
  }

  clearObservables() {
    //do this to prevent new user logins from viewing the old user's inbox
    this.emailMessagesRequest$ = null;
  }
}
