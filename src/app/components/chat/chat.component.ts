import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private uiService: UiService) {
    this.uiService.showSidebar = false;
  };

  ngOnInit(): void {
    this.uiService.showNavContent.next(false);
  };

};
