import { FormsModule } from "@angular/forms";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProduitComponent } from './produit.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  declarations: [ProduitComponent]
})
export class ProduitModule { }
