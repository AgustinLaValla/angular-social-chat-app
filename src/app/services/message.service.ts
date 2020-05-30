import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { URL } from '../../config/url.config';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MessageService {

    public onlineUsers = new BehaviorSubject<any>([]);

    constructor(private http: HttpClient) { }

    getAllMessages(senderId: string, receiverId: string) {
        return this.http.get(`${URL}/chat-messages/${senderId}/${receiverId}`).pipe(map(resp => resp['messages']));
    };

    sendMessage(senderId: string, receiverId: string, receivername: string, message: string): Observable<any> {
        return this.http.post(`${URL}/chat-messages/${senderId}/${receiverId}`, { receiverId, receivername, message });
    };

    markMessageAsRead(sender: string, receiver: string) {
        return this.http.put(`${URL}/chat-messages/mark/${sender}/${receiver}`, {})
    };

    markAllMessagesAsRead() { 
        return this.http.put(`${URL}/chat-messages/mark-all-messages/`, {});
    }

};