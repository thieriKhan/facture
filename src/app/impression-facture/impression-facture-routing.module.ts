
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ImpressionFacturePage } from './impression-facture.page';

const routes: Routes = [
  {
    path: '',
    component: ImpressionFacturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class ImpressionFacturePageRoutingModule {}
