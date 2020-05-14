import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: '', loadChildren: () => import('./components/auth-tabs/auth-tabs.module').then(m => m.AuthTabsModule) },
  { path: 'streams', loadChildren: () => import('./components/streams/streams.module').then(m => m.StreamsModule), canActivate:[AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
