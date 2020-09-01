import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription, Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit, OnDestroy {

  private paramsObs$ = new Subscription();
  private chatRefreshListener$ = new Subscription();
  private isTypingListener$ = new Subscription();
  private escapeListener$ = new Subscription();
  private onlineUsersObs$ = new Subscription();

  public onlineUsers: any;
  public receivername: string;
  public receiverData: any;
  public user: any;
  public username: string;
  public message: string = '';
  public isOnline: boolean = false;
  public messages = [];
  public typingMessage;
  public typing: boolean = false;

  public showEmojiPicker: boolean = false;

  @ViewChild('scroller') public scroller: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private userService: UsersService,
    private messageService: MessageService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.user = this.tokenService.getTokenPayload().user;
    this.username = this.tokenService.getUserName();
    this.refreshChatListener();
    this.isTypingListener();
    this.closePickerHandler();
    this.paramsObs$ = this.activatedRoute.params.subscribe(params => {
      this.getUserById(params['id']);
    })
  };

  ngAfterViewInit() {
    const params = {
      room1: this.username,
      room2: this.receivername
    };
    this.socketService.emit('join chat', params);
  };

  getUserByName(username: string) {
    this.userService.getUserByUsername(username).subscribe(receiver => {
      this.receiverData = receiver;
      this.getAllMessages();
    });
  };

  getUserById(id: string) {
    this.userService.getUserById(id).subscribe(receiver => {
      this.receiverData = receiver;
      this.receivername = receiver.username;
      this.getAllMessages();
      this.getUsersOnline();
    });
  };

  getUsersOnline() {
    this.onlineUsersObs$ = this.messageService.onlineUsers.subscribe(onlineUsers => {
      console.log(onlineUsers);
      const container = document.querySelector('.nameCol');
      const isReceiverUserOnline = onlineUsers.find(user => user === this.receivername);
      if (isReceiverUserOnline) {
        this.isOnline = true;
        (container as HTMLElement).style.margin = '0px';
      } else {
        this.isOnline = false;
        (container as HTMLElement).style.margin = '16px 0px';
      };
    });
  };


  getAllMessages() {
    this.messageService.getAllMessages(this.user._id, this.receiverData._id).subscribe((resp) => {
      this.messages = resp[0].message;
      setTimeout(() => this.scroller.nativeElement.scrollTop = this.scroller.nativeElement.scrollHeight, 50);
    });
  };

  sendMessage() {
    if (this.message.length > 0) {
      this.messageService.sendMessage(this.user._id, this.receiverData._id, this.receivername, this.message).subscribe(() => {
        this.message = '';
        this.socketService.emit('refresh-chat');
      });

    };
  };

  refreshChatListener() {
    this.chatRefreshListener$ = this.socketService.listen('refresh-chat').subscribe(() => this.getAllMessages());
  };

  isTyping(): void {
    this.socketService.emit('start-typing', {
      sender: this.username,
      receiver: this.receivername
    });

    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socketService.emit('stop-typing', {
        sender: this.username,
        receiver: this.receivername
      })
    }, 2000);
  };

  isTypingListener() {
    this.isTypingListener$ = this.socketService.listen('is-typing').subscribe((data) => {
      if (data['sender'] === this.receivername) {
        this.typing = data['typing'];
        setTimeout(() => this.scroller.nativeElement.scrollTop = this.scroller.nativeElement.scrollHeight, 50);
      };
    });
  };

  addEmoji(event) {
    this.message += event.emoji.native;
  };

  closePickerHandler() {
    document.addEventListener('keyup', (event) => {
      if (event.keyCode === 27) {
        this.showEmojiPicker = false;
      };
    });
  };

  ngOnDestroy(): void {
    this.paramsObs$.unsubscribe();
    this.chatRefreshListener$.unsubscribe();
    this.isTypingListener$.unsubscribe();
    this.escapeListener$.unsubscribe();
    this.onlineUsersObs$.unsubscribe();
  };

};
