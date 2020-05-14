import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({providedIn: 'root'})

export class TokenService {
    
    constructor(private cookieService: CookieService) { }

    setToken(token:string) { 
        this.cookieService.set('chat_token' , token);
    };

    getToken() { 
        return this.cookieService.get('chat_token');
    };

    deleteToken() { 
        return this.cookieService.delete('chat_token');
    }
    
}