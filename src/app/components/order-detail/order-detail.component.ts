import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IonNavLink, NavParams, AlertController } from '@ionic/angular';
import { ModalController, IonNav } from '@ionic/angular';

import { PrintPreviewComponent } from '../../impression-facture/print-preview/print-preview.component';
import { ClientOrder, Order, Produit } from '../../containers';
import { ItemsService } from '../../services/items.service';
import { FacturesService } from '../../services/factures.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  nextPage = PrintPreviewComponent;
  clientOrders: Order[];
  products : Produit[];
  client;
  props;
  total;
  postFactSub: Subscription;
  constructor(
    private modalCtrl: ModalController,
     private nav: IonNav,
    private route: Router,
    private item: ItemsService,
    private navParam: NavParams,
    private alertCtrl: AlertController,
    private fact: FacturesService
    ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.clientOrders = this.item.allCurrentClientsOrders.find(item => item.idClient = this.item.currentClintid).orders;
    this.products=  this.item.allProducts;
    this.total = this.navParam.data.total;

  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  getProduit(id){
    return this.products.find(item => item.id === id);


  }

 async  next(){

    const alert = await this.alertCtrl.create({
      cssClass: 'alert',
      header: 'Confirmation',
      message: 'En cofirmant , vous valider automatiquement l\'achat pas de retour possible',
      buttons: [
        {
          role: 'cancel',
          text: 'NON'
        },
        {
          text: 'OUI',
          handler: async ()=>{
            alert.dismiss();
            const navData = this.navParam.data.allData
            const order =  navData.map( data=> data.order);
            const formatedData =
              {
                customerId: this.item.currentClintid,
                paymentMode: 'CASH',
                comment: '',
                orderItems: order
              };
              console.log('form', formatedData);
              this.postFactSub = (await this.fact.postFacture(formatedData)).subscribe(
                async (data)=>{
                  console.log('success', data);
                  this.props = data;
                  await  this.nav.push(this.nextPage, this.props );
                }
              );


          }
        }
      ]
    });

     alert.present();

  }







}
