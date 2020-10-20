import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SocketService } from './services/socket.service';

declare const gapi: any // Google Api Library (imported at index.html)

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router, 
    private authService: AuthService,
    private socketService: SocketService  
    ) { }

  ngOnInit(): void {
    this.authService.initGoogleApi(gapi);
    this.router.navigate(['']);
  };

  ngOnDestroy() {
    this.socketService.disconnect();
  }
}
