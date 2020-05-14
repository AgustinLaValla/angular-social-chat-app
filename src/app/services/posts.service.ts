import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../config/url.config';

@Injectable({providedIn: 'root'})

export class PostsService {

    private url:string = URL

    constructor(private httpClient:HttpClient) { }
    
    addPost(body): Observable<any> {
        const url = `${this.url}/posts/add-post`;
        return this.httpClient.post(url, body);
    };
    
};