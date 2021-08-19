import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavBarPage } from './nav-bar.page';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: NavBarPage,
    children:[

      {
        path: 'impression-facture',
        loadChildren: () => import('../impression-facture/impression-facture.module').then( m => m.ImpressionFacturePageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'impression-facture/:id',
        loadChildren: () => import('../impression-facture/impression-facture.module').then( m => m.ImpressionFacturePageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'ajout-facture',
        loadChildren: () => import('../ajout-facture/ajout-facture.module').then( m => m.AjoutFacturePageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'activity',
        loadChildren: () => import('../activity/activity.module').then( m => m.ActivityPageModule)
      },
      {
        path: 'items/:id',
        loadChildren: () => import('../items/items.module').then( m => m.ItemsPageModule)
      },
      {
        path: '',
        redirectTo: 'ajout-facture'
      },
      {
        path: 'items',
        redirectTo: 'ajout-facture'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavBarPageRoutingModule {}
