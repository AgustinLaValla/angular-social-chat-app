import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class PostsService {

    private url: string = environment.URL;
    public postLimit: number = 10;
    public totalPost: number = 0;
    public topPostsLimit: number = 10;
    public totalTopPost: number = 0;

    constructor(private http: HttpClient) { }

    getAllPost(): Observable<any> {
        return this.http.get(`${this.url}/posts?limit=${this.postLimit}`);
    };

    getTopPosts(): Observable<any> { 
        return this.http.get(`${this.url}/posts/top/get-all?limit=${this.topPostsLimit}`);
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

    editPost(post:any) {
        return this.http.put(`${this.url}/posts/edit-post`, post);
    };

    deletePost(id:string) { 
        return this.http.delete(`${this.url}/posts/delete-post/${id}`);
    };

};