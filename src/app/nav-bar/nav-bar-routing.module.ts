import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavBarPage } from './nav-bar.page';

const routes: Routes = [
  {
    path: '',
    component: NavBarPage,
    children:[

      {
        path: 'impression-facture',
        loadChildren: () => import('../impression-facture/impression-facture.module').then( m => m.ImpressionFacturePageModule)
      },
      {
        path: 'ajout-facture',
        loadChildren: () => import('../ajout-facture/ajout-facture.module').then( m => m.AjoutFacturePageModule)
      },
      {
        path: '',
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
