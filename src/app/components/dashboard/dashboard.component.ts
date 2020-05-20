import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public username:string;

  constructor(private socketService:SocketService ,private tokenService:TokenService) { }

  ngOnInit(): void {
    this.username = this.tokenService.getTokenPayload().user.username;
    this.socketService.checkStatus();
  }

}
