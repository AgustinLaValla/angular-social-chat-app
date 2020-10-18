import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../config/url.config';
import { UiService } from './ui.service';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = URL;
  public auth2: any;
  public gapi: any;

  constructor(
    private http: HttpClient,
    private uiService: UiService,
    private tokenService: TokenService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) { }

  signUp(body) {
    const url = `${this.url}/auth/register`;
    return this.http.post(url, body);
  };

  signIn(body: { email: string, password: string }) {
    const url = `${this.url}/auth/login`;
    return this.http.post(url, body)
  }

  signInWithGoogleAccount(token: string) {
    const url = `${this.url}/auth/google-login`;
    return this.http.post(url, { token });
  }

  initGoogleApi(gapi) {
    this.gapi = gapi;
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '337218875190-1fch0gemblkajnmbmtfg89u764mjrleh.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
    });

  }

  initGoogleButtons() {
    const googleButtons = this.document.querySelectorAll('.btn_google');
    googleButtons.forEach(button => this.attachSignIn(button));
  };

  attachSignIn(element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      this.uiService.loadingSubjet.next(true);
      let token = googleUser.getAuthResponse().id_token;
      this.signInWithGoogleAccount(token).pipe(
        map(resp => {

          this.tokenService.setToken(resp['token']);

          this.tokenService.setUserName(resp['user'].username);

          this.uiService.loadingSubjet.next(false);

          window.location.href = '/';

        })
      ).subscribe();

    });
  };


};
