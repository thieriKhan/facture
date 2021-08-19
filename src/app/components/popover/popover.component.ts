import { LoginService } from "./../../services/login.service";
import { Component, OnInit } from '@angular/core';

import {PopoverController, AlertController } from '@ionic/angular'

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(
    private log: LoginService,
    private popC: PopoverController,
    private alertCtrl: AlertController

  ) { }

  ngOnInit() {}
  logout(){
    this.log.logout();
    this.popC.dismiss();
  }
  close(){

    this.popC.dismiss();
  }

  async ajoutProduit(){
    this.popC.dismiss();
    
    const alert = await  this.alertCtrl.create({
    header: 'Ajouter un produit',
    cssClass: 'alert',
    inputs: [
      {

        name: 'DetailPrice',
        placeholder: 'prix en detail',
        type: 'number'
      },
          {
        name: 'containerPrice',
        placeholder: 'prix en gros',
        type: 'number'
      },
      {

        name: 'containerQty',
        placeholder: 'quantite en gros',
        type: 'number'
      },
      {

        name: 'detailQty',
        placeholder: 'quantite en detail',
        type: 'number'
      }

    ],
    buttons: [
      {
        text: 'fermer',
        role: 'cancel'
      },
      {
        text: 'ajouter',
        handler: async (data)=>{
          console.log('modifie');
        }


    }]  });
    alert.present();
    
  }

 async ajoutClient(){
   this.popC.dismiss();
    console.log('ajouter un client');
    const alert = await  this.alertCtrl.create({
    header: 'Ajouter un client',
    cssClass: 'alert',
    inputs: [
      {

        name: 'nom',
        placeholder: 'nom',
        type: 'text'
      },
          {

        name: 'prenom',
        placeholder: 'prenom',
        type: 'text'
      },
          {

        name: 'email',
        placeholder: 'email',
        type: 'email'
      }
    ],
    buttons: [
      {
        text: 'fermer',
        role: 'cancel'
      },
      {
        text: 'ajouter',
        handler: async (data)=>{
          console.log('modifie');
        }


    }]  });
    alert.present();
  }

}
