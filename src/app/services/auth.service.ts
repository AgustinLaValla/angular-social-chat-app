import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url:string = 'http://localhost:3000/api/chatapp';

  constructor(private http: HttpClient) { }

  signUp(body) {
    const url = `${this.url}/auth/register`;
    return this.http.post(url, body).pipe(map(resp => resp['token']));
  };

  signIn(body:{email:string, password:string}) { 
    const url = `${this.url}/auth/login`;
    return this.http.post(url, body)
  }

};
