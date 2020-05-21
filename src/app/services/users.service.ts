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

    followUser(id:string):Observable<any> { 
        return this.http.put(`${URL}/friends/follow-user`, {_id:id});
    };

};