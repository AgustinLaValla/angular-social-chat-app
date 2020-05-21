import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  public users: any[] = [];

  public currentUser:any;

  constructor(private usersService: UsersService, private tokenService:TokenService) { }

  ngOnInit(): void {
    this.getUsers();
    this.currentUser = this.tokenService.getTokenPayload().user;
    console.log(this.currentUser);
  };

  getUsers() {
    this.usersService.getAllUsers().subscribe(users => this.users = users);
  };

  followUser(id:string) { 
    this.usersService.followUser(id).subscribe(() => this.getUsers());
  }

  checkFollowing(followers:any[]) { 
    return _.some(followers, { follower: this.currentUser._id });
  };

};
