import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient) { }

    helloWorld(): Observable<any> {
        let url = "http://localhost:8080/helloworld";
        return this.http.get<any>(url);
    }
}
