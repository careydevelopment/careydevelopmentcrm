import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

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
}
