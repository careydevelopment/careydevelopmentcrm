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
}
