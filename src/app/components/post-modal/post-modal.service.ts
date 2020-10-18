import { Injectable, EventEmitter } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class PostModalService {

    public open = new EventEmitter<boolean>();

    public postValue: any;

    constructor() { }

    public openDialog(post: any) {
        this.postValue = post;
        this.open.emit(true);
    };
    
    public closeDialog() { 
        this.open.emit(false);
        this.postValue = null;
    };

};
