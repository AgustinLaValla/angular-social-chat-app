import { Component, OnInit, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import * as M from 'materialize-css';
import { GeoLocationService } from 'src/app/services/geo-location.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.css']
})
export class StreamsComponent implements OnInit, OnDestroy {

  public username: string;

  public streamsTab = true;
  public topStreamTab = false;

  private isLodingSub$ = new Subscription();
  public isLoading: boolean = false;

  constructor(
    private uiService: UiService,
    private geoLocationService: GeoLocationService
  ) {
    this.uiService.showSidebar = true;
    this.geoLocationService.getGeoLocation().subscribe();
  }

  ngOnInit(): void {
    this.uiService.showNavContent.next(true);

    const tabs = document.querySelector('.tabs');
    new M.Tabs(tabs, {});

    this.setLoadingListener();

  };

  changeTabs(value) {
    if (value === 'streams') {
      this.streamsTab = true;
      this.topStreamTab = false
    } else {
      this.streamsTab = false;
      this.topStreamTab = true;
    };
  };

  setLoadingListener() {
    this.isLodingSub$ = this.uiService.loadingSubjet.subscribe({
      next: isLoading => this.isLoading = isLoading
    });
  }

  ngOnDestroy(): void {
    this.isLodingSub$.unsubscribe();
  }

};
