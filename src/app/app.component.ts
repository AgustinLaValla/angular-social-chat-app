import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

declare const gapi: any // Google Api Library (imported at index.html)

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private authService:AuthService) { }

  ngOnInit(): void {
    this.authService.initGoogleApi(gapi);
    this.router.navigate(['']);
  };
}
