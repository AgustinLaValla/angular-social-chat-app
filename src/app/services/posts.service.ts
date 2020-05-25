import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../config/url.config';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class PostsService {

    private url: string = URL

    constructor(private http: HttpClient) { }

    getAllPost(): Observable<any> {
        return this.http.get(`${this.url}/posts`).pipe(map((resp) => resp['posts']));
    };

    getTopPosts(): Observable<any> { 
        return this.http.get(`${this.url}/posts/top/get-all`).pipe(map((resp) => resp['posts']))
    }

    getPost(id:string): Observable<any> { 
        return this.http.get(`${this.url}/posts/${id}`).pipe(map(resp => resp['post']));
    }

    addPost(body): Observable<any> {
        const url = `${this.url}/posts/add-post`;
        return this.http.post(url, body);
    };

    addLike(body:any): Observable<any> {
        return this.http.post(`${this.url}/posts/add-post-like`, body);
    };

    addComment(postId:string, comment:string) { 
        return this.http.post(`${this.url}/posts/add-comment`, {postId, comment});
    };

};