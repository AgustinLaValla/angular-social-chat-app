import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./components/auth-tabs/auth-tabs.module').then(m => m.AuthTabsModule) },
  { path: 'streams', loadChildren: () => import('./components/streams/streams.module').then(m => m.StreamsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
