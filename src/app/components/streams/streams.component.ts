import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import * as M from 'materialize-css';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.css']
})
export class StreamsComponent implements OnInit {

  public username:string;

  public streamsTab = true;
  public topStreamTab = false;

  constructor(private uiService:UiService) { }

  ngOnInit(): void { 
    this.uiService.showNavContent.next(true);

    const tabs = document.querySelector('.tabs');
    new M.Tabs(tabs, {})

  };

  changeTabs(value) { 
    if(value === 'streams') { 
      this.streamsTab = true;
      this.topStreamTab = false
    } else  {
      this.streamsTab = false;
      this.topStreamTab = true;
    };
  };



};
