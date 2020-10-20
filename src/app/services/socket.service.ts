import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({ providedIn: 'root' })
export class SocketService {

    constructor(private socket: Socket) { 
        this.socket.emit('refresh-posts', {data:'test message'});
    }

    checkStatus() {
        this.socket.on('connect', () => console.log('User is connected to the server'));
        this.socket.on('disconnect', () =>  console.log('Server connection has finished'));
    };

    emit(event: string, payload?: any, callback?: Function) {
        this.socket.emit(event, payload, callback);
    };

    listen(event: string) {
        return this.socket.fromEvent(event);
    };

    disconnect() {
        this.socket.disconnect();
    }

};