import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../contacts/models/contact';
import { environment } from '../../../environments/environment';

const baseUrl: string = environment.baseContactServiceUrl;

@Injectable({ providedIn: 'root' })
export class ContactService {

  constructor(private http: HttpClient) { }

  create(contact: Contact): Observable<Contact> {
    let url = `${baseUrl}/contact/`;
    console.log("Create contact URL is " + url);

    return this.http.post<Contact>(url, contact);
  }

  doesEmailExist(email: string): Observable<boolean> {
    let url = `${baseUrl}/contact/emailcheck`;

    let content: any = {};
    content.email = email;

    let response$: Observable<boolean> = this.http.post<boolean>(url, content);

    return response$;
  }
}
