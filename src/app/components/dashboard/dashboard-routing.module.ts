import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

const routes: Routes = [{
  path: '', component: DashboardComponent, children: [
    { path: '', loadChildren: () => import('../streams/streams.module').then(m => m.StreamsModule) },
    { path: 'people', loadChildren: () => import('../people/people.module').then(m => m.PeopleModule) },
    { path: 'post/:id', loadChildren: () => import('../comments/comments.module').then(m => m.CommentsModule) },
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
