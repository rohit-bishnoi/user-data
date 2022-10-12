import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly rootUrl = 'https://localhost:7283/api/'

  constructor(private http: HttpClient) { }

  registerUser(user: Array<string>) {
    return this.http.post(this.rootUrl + 'Users/register', {
      Username: user[0],
      Email: user[1],
      Mobile: user[2],
      Password: user[3]
    },
    {
      responseType: 'text',
    });
  }

  loginUser(user: Array<string>) {
    return this.http.post(this.rootUrl + 'Users/login', {
      Username: user[0],
      Password: user[1]
    },
    {
      responseType: 'text',
    });
  }

  getData() {
    return this.http.get(this.rootUrl + 'Users/GetAll');
  }
}
