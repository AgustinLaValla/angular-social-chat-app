import { Component, OnInit, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  
  constructor(private uiService: UiService) { }

  ngOnInit(): void {
    this.uiService.showNavContent.next(false);
    this.uiService.showSidebar.next(false);
  };

};
