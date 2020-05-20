import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @Input() public username:string;

  private navContentSubs$ = new Subscription();
  public showNavContent: boolean = true;

  constructor(private tokenService:TokenService ,
              private router:Router,
              private uiService:UiService) { }

  ngOnInit(): void { 
    this.navContentSubs$ = this.uiService.showNavContent.subscribe(show => this.showNavContent = show);
  }

  logout() { 
    this.tokenService.deleteToken();
    this.tokenService.deleteUserName();
    this.router.navigate(['/login']);
  };

  ngOnDestroy(): void {
    this.navContentSubs$.unsubscribe();
  };

}
