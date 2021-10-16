import { StorageService } from "./../../services/storage.service";
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IonNavLink, NavParams, AlertController } from '@ionic/angular';
import { ModalController, IonNav } from '@ionic/angular';

import { PrintPreviewComponent } from '../../impression-facture/print-preview/print-preview.component';
import { ClientOrder, Order, Produit } from '../../containers';
import { ItemsService } from '../../services/items.service';
import { FacturesService } from '../../services/factures.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  nextPage = PrintPreviewComponent;
  clientBSubject: BehaviorSubject<Order[]> = new BehaviorSubject([]);
  clientOrders: Order[];
  products: Produit[];
  client;
  props;
  total;
  postFactSub: Subscription;
  phone= '';
  constructor(
    private modalCtrl: ModalController,
     private nav: IonNav,
    private route: Router,
    private item: ItemsService,
    private navParam: NavParams,
    private alertCtrl: AlertController,
    private fact: FacturesService,
    private storage: StorageService,
    private log: LoginService
      ) { }

  ngOnInit() {
    this.phone = this.log.getUser().phone;
      const navData = this.navParam.data.allData;
    const order =  navData.map( data=> data.order);
    this.clientOrders = order;
    this.clientBSubject.next(this.clientOrders)
  }
  async ionViewWillEnter(){
    const navData = this.navParam.data.allData;
    const order =  navData.map( data=> data.order);
    this.clientOrders = order;
    this.phone = this.log.getUser().phone;
    this.item.allCurrentClientsOrders = await this.storage.get('allOrders');
    this.clientOrders = this.item.allCurrentClientsOrders.find(item => item.idClient === this.item.currentClintid).orders;
      this.products=  this.item.allProducts;
    this.total = this.navParam.data.total;
    this.clientBSubject.next(this.clientOrders);
 

  }

  closeModal(){
    this.modalCtrl.dismiss({ total: this.total});
  }

  getProduit(id){
    return this.products.find(item => item.id === id);
  }
 async  deleteItem(id){
    this.clientOrders =   this.clientOrders.filter(item => item.id !== id);
    this.clientBSubject.next(this.clientOrders);
    const clientId =  this.item.currentClintid
    const allOrders =await  this.storage.get('allOrders')

  let montant = 0;
  let deletedItem = {id: '0', containerQuantity: 0, pieceQuantity: 0}

    if(!(allOrders == undefined || allOrders == null)){
      let clientOrder = allOrders.find(item => item.idClient === clientId);
      if(clientOrder != undefined && clientOrder != null  ){
        const order = clientOrder.orders.filter(item => item.id !== id);
        const prod = this.getProduit(id)
    
        if(prod != undefined || prod != null)
        {
            const navData = this.navParam.data.allData;
            const navOrder =  navData.map( data=> data.order);
            
          deletedItem = navOrder.find(item => item.id === id);
          montant = (prod.pieceSalePrice * deletedItem.pieceQuantity) +
           (prod.containerSalePrice* deletedItem.containerQuantity);
           this.total -= montant;   
                  }
        allOrders[allOrders.indexOf(clientOrder)].orders = order;
        this.storage.set('allOrders', allOrders);
      }
    }
    

  }

 async  next(){

    const alert = await this.alertCtrl.create({
      cssClass: 'alert',
      header: 'Confirmation',
      message: 'En confirmant , vous validez automatiquement l\'achat. Pas de retour possible',
      buttons: [
        {
          role: 'cancel',
          text: 'NON'
        },
        {
          text: 'OUI',
          handler: async ()=>{
            alert.dismiss();
            
            const formatedData =
              {
                createdBy: this.phone,
                customerId: this.item.currentClintid,
                paymentMode: 'CASH',
                comment: '',
                orderItems: this.clientOrders
              };
              this.postFactSub = (await this.fact.postFacture(formatedData)).subscribe(
                async (data)=>{
                  this.props = data;
                  await  this.nav.push(this.nextPage, this.props );
                },
                (error)=>{
                  this.modalCtrl.dismiss({done: true, total: this.total});
                }
              );
             
              await this.storage.remove('montant');


          }
        }
      ]
    });

     alert.present();

  }







}
