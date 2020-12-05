import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from '../../models/user';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};


@Injectable({ providedIn: 'root' })
export class UserService {

  private _user: User = null;

  constructor(private http: HttpClient) { }

  get user(): User {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
  }

  fetchProfileImage(userId: string): Observable<Blob> {
    let url = "http://localhost:8080/user/" + userId + "/profileImage";
    console.log("Profile image URL is " + url);

    return this.http.get(url, { responseType: 'blob' });
  }

  update(userId: string, updatedUser: User): Observable<User> {
    let url = "http://localhost:8080/user/" + userId;
    console.log("Update user URL is " + url);

    let user$ = this.http.put<User>(url, updatedUser, httpOptions);
    
    return user$.pipe(
      tap(updatedUser => this._user = updatedUser)
    )
  }
}
