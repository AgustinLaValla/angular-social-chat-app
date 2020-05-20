import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })

export class TokenService {

    constructor(private cookieService: CookieService) { }

    setToken(token: string) {
        this.cookieService.set('chat_token', token);
    };

    getToken() {
        return this.cookieService.get('chat_token');
    };

    deleteToken() {
        return this.cookieService.delete('chat_token');
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
        return this.cookieService.set('username' , username);
    };

    getUserName() { 
        return this.cookieService.get('username');
    };

    deleteUserName() { 
        return this.cookieService.delete('username');
    };
}