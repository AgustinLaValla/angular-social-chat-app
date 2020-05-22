import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../config/url.config';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UsersService {

    constructor(private http:HttpClient) { }
    
    getAllUsers():Observable<any> { 
        return this.http.get(`${URL}/user`).pipe(map(resp => resp['users']));
    };

    getUserById(id:string):Observable<any> { 
        return this.http.get(`${URL}/user/${id}`).pipe(map(resp => resp['user']));
    };

    getUserByUsername(username:string):Observable<any> { 
        return this.http.get(`${URL}/user/get-user/${username}`).pipe(map(resp => resp['user']));
    };

    followUser(id:string):Observable<any> { 
        return this.http.put(`${URL}/friends/follow-user`, {_id:id});
    };

    unFollowUser(id:string) { 
        return this.http.put(`${URL}/friends/unfollow-user`, {_id:id});
    }

};