import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { SocketService } from '../../services/socket.service';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public username: string;

  private showSidebarListener$ = new Subscription();
  public show: boolean = true;

  constructor(
    private uiService: UiService,
    private socketService: SocketService,
    private tokenService: TokenService) {

  }

  ngOnInit(): void {
    setTimeout(() => this.showSidebarListener$ = this.uiService.showSidebar.subscribe(show => this.show = show),100);
    this.username = this.tokenService.getUserName();
    this.socketService.checkStatus();
  }

  ngOnDestroy(): void {
    this.showSidebarListener$.unsubscribe();
  };

}
