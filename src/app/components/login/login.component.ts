import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private uiService: UiService,
    private router: Router,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.authService.initGoogleButtons();
  }

  signIn(f: NgForm) {
    this.uiService.loadingSubjet.next(true);

    this.authService.signIn(f.value).pipe(
      tap({
        next: resp => {
          this.tokenService.setToken(resp['token']);

          this.tokenService.setUserName(resp['user'].username);

          this.uiService.loadingSubjet.next(false);

          this.router.navigate(['/']);
        }
      }),
      catchError(error => of(
        this.uiService.errorHandler(error),
        this.uiService.loadingSubjet.next(false)
      ))
    ).subscribe();
  };


};
