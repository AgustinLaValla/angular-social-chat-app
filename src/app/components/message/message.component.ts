import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Renderer2, ViewChildren, QueryList, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import { MessageService } from 'src/app/services/message.service';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
  private messagesLimit: number = 20;
  private totalMessages: number = 0;
  private messagesRequestedFromScroll: boolean = false;
  private firstRequest: boolean = true;
  private lastScrollHeight: number = 0;

  public showEmojiPicker: boolean = false;

  @ViewChild('scrollFrame') scrollFrame: ElementRef<HTMLDivElement>;
  @ViewChildren('messagesBox') messagesBox: QueryList<ElementRef>;
  @ViewChild('nameCol') nameCol: ElementRef<HTMLElement>;


  constructor(
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    public userService: UsersService,
    private messageService: MessageService,
    private socketService: SocketService,
    private renderer: Renderer2,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.tokenService.getTokenPayload().user;
    this.username = this.tokenService.getUserName();
    this.refreshChatListener();
    this.isTypingListener();
    this.closePickerHandler();
    this.paramsObs$ = this.activatedRoute.params.pipe(
      tap({ next: params => this.getUserById(params['id']) })
    ).subscribe()
  };

  ngAfterViewInit() {
    const params = {
      room1: this.username,
      room2: this.receivername
    };
    this.socketService.emit('join chat', params);

    this.messagesBox.changes.subscribe(() => this.scrollToBottom());
  };

  private scrollToBottom(): void {
    this.renderer.selectRootElement(window).scroll({
      top: !this.messagesRequestedFromScroll
        ? this.scrollFrame.nativeElement.scrollHeight
        : this.scrollFrame.nativeElement.scrollHeight - this.lastScrollHeight,
      left: 0,
      behavior: !this.messagesRequestedFromScroll ? 'smooth' : 'auto'
    })
    this.messagesRequestedFromScroll = false;
  }

  getUserById(id: string) {
    this.userService.getUserById(id).pipe(
      map(({user}) => (
        this.receiverData = user,
        this.receivername = user.username,
        this.getAllMessages(),
        this.getUsersOnline()
      ))
    ).subscribe();
  };

  getUsersOnline() {
    this.onlineUsersObs$ = this.messageService.onlineUsers.pipe(
      map((onlineUsers) => onlineUsers.find(user => user === this.receivername)),
      map(isReceiverUserOnline => {
        if (isReceiverUserOnline) {
          this.isOnline = true;
          this.renderer.setStyle(this.nameCol.nativeElement, 'margin', 0);
        } else {
          this.isOnline = false;
          this.renderer.setStyle(this.nameCol.nativeElement, 'margin', '16px 0px');
        };
      })
    ).subscribe();
  };


  getAllMessages() {
    console.log('called');
    this.messageService.getAllMessages(this.user._id, this.receiverData._id, this.messagesLimit).pipe(
      map((resp: { messages: any[], total: number }) => {
        this.messages = resp.messages[0].message;
        this.totalMessages = resp.total;
        if (this.firstRequest) {
          this.firstRequest = false;
        }
      })
    ).subscribe();
  };

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if (this.firstRequest) return;
    const scrollTop: number = event.target.scrollingElement.scrollTop;
    if (scrollTop === 0 && this.messagesLimit < this.totalMessages) {
      this.messagesLimit += 20;
      this.messagesRequestedFromScroll = true;
      this.lastScrollHeight = this.scrollFrame.nativeElement.scrollHeight;
      this.getAllMessages();
    }
  }

  sendMessage() {
    if (this.message.length > 0) {
      this.messageService.sendMessage(this.user._id, this.receiverData._id, this.receivername, this.message).pipe(
        map(() => {
          this.message = '';
          if (this.messagesLimit <= this.totalMessages) {
            this.messagesLimit++;
          }
        }),
        tap(({ next: () => this.socketService.emit('refresh-chat') }))
      ).subscribe();

    };
  };

  refreshChatListener() {
    this.chatRefreshListener$ = this.socketService.listen('refresh-chat').pipe(
      tap({ next: () => this.getAllMessages() })
    ).subscribe();
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
    this.isTypingListener$ = this.socketService.listen('is-typing').pipe(
      map(data => {
        if (data['sender'] === this.receivername) {
          this.typing = data['typing'];
          this.scrollToBottom();
        };
      })
    ).subscribe();
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

  goToUserProfile() {
    if (this.receiverData) {
      this.router.navigate(['/user', this.receiverData._id]);
    }
  }

  ngOnDestroy(): void {
    this.paramsObs$.unsubscribe();
    this.chatRefreshListener$.unsubscribe();
    this.isTypingListener$.unsubscribe();
    this.escapeListener$.unsubscribe();
    this.onlineUsersObs$.unsubscribe();
  };

};
