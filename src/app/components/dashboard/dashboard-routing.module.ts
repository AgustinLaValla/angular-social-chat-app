import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

const routes: Routes = [{
  path: '', component: DashboardComponent, children: [
    { path: '', loadChildren: () => import('../streams/streams.module').then(m => m.StreamsModule) },
    { path: 'people', loadChildren: () => import('../people/people.module').then(m => m.PeopleModule) },
    { path: 'post/:id', loadChildren: () => import('../comments/comments.module').then(m => m.CommentsModule) },
    { path: 'following', loadChildren: () => import('../following/following.module').then(m => m.FollowingModule) },
    { path: 'followers', loadChildren: () => import('../followers/followers.module').then(m => m.FollowersModule) },
    { path: 'notifications', loadChildren: () => import('../notifications/notifications.module').then(m => m.NotificationsModule) },
    { path: 'images', loadChildren: () => import('../images/images.module').then(m => m.ImagesModule) },
    { path: 'user/:id', loadChildren: () => import('../view-user/view-user.module').then(m => m.ViewUserModule) },
    { path: 'account/password', loadChildren: () => import('../change-password/change-password.module').then(m => m.ChangePasswordModule) },
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
