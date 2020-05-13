import { Component, OnInit, OnDestroy } from '@angular/core';
import * as M from 'materialize-css';
import { Subscription } from 'rxjs';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-auth-tabs',
  templateUrl: './auth-tabs.component.html',
  styleUrls: ['./auth-tabs.component.css']
})
export class AuthTabsComponent implements OnInit, OnDestroy {

  private loadingSubs$ = new Subscription();
  public isLoading: boolean = false;

  constructor(private uiService: UiService) {
    this.loadingSubs$ = this.uiService.loadingSubjet.subscribe(isLoading => this.isLoading = isLoading);
  }

  ngOnInit(): void {
    const tabs = document.querySelector('.tabs');
    const materialTabs = new M.Tabs(tabs, {});
  };

  
  ngOnDestroy(): void {
    this.loadingSubs$.unsubscribe();
  };

};
