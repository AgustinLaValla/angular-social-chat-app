import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.css']
})
export class StreamsComponent implements OnInit {

  public username:string;

  constructor(private uiService:UiService) { }

  ngOnInit(): void { 
    this.uiService.showNavContent.next(true);
  };



};
