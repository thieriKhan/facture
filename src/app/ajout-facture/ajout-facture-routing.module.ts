import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjoutFacturePage } from './ajout-facture.page';

const routes: Routes = [
  {
    path: '',
    component: AjoutFacturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjoutFacturePageRoutingModule {}
