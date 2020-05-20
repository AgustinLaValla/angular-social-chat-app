import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private tokenService:TokenService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.tokenService.getToken();

    if(token) { 

      const headerConfig = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

      const newRequest = req.clone({
        setHeaders: headerConfig
      });

      return next.handle(newRequest);
    };

    return next.handle(req);

  }
}
