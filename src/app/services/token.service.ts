import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })

export class TokenService {

    constructor(private cookieService: CookieService) { }

    setToken(token: string) {
        this.cookieService.set('chat_token', token);
        console.log(token);
    };

    getToken() {
        return this.cookieService.get('chat_token');
    };

    deleteToken() {
        this.cookieService.delete('chat_token');
        console.log(this.getTokenPayload());
    };

    getTokenPayload() {
        const token = this.getToken();
        let payload;
        if (token) {
            payload = token.split('.')[1];
            payload = JSON.parse(atob(payload));
        };
        return payload;
    };

    setUserName(username: string) {
        this.cookieService.set('username', username);
    };

    getUserName() {
        return this.cookieService.get('username');
    };

    deleteUserName() {
        this.cookieService.delete('username');
        console.log(this.getUserName());
    };
}