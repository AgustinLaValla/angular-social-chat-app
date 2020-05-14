import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../config/url.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url:string = URL;

  constructor(private http: HttpClient) { }

  signUp(body) {
    const url = `${this.url}/auth/register`;
    return this.http.post(url, body);
  };

  signIn(body:{email:string, password:string}) { 
    const url = `${this.url}/auth/login`;
    return this.http.post(url, body)
  }

};
