import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'nav-bar',
    pathMatch: 'full'
  },
  {
    path: 'nav-bar',
    canLoad: [AuthGuard],
    loadChildren: () => import('./nav-bar/nav-bar.module').then( m => m.NavBarPageModule)
  },
  {
    path: 'login',
    canLoad: [UnauthGuard],
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'historique',
    loadChildren: () => import('./historique/historique.module').then( m => m.HistoriquePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
