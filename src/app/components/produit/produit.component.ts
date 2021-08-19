
import { ClientOrder, Order, Produit } from './../../containers';
import { IonCheckbox, IonItem, ModalController } from '@ionic/angular';
import { Component, ComponentRef, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.scss'],
})


export class ProduitComponent implements OnInit {
montant = 0;

container: Select   = {isChecked: false, color: 'light', quantity: 0};

detail: Select = { isChecked: false, color: 'light', quantity: 0};
currentProduct: Produit;
produit: Produit;
currentClientId;
newOrder: Order ={containerQuantity : 0, pieceQuantity: 0, id: ' '};



  constructor(
    private modalCtrl: ModalController,
    private navParam: NavParams,
    private item: ItemsService) {

     }
  close(){
    this.modalCtrl.dismiss();

  }
 async  save(){
    if(this.container.isChecked ){
      this.newOrder .containerQuantity = this.container.quantity;
    }
    if(this.detail.isChecked){
      this.newOrder.pieceQuantity = this.detail.quantity;
    }

    if(this.container.quantity !== 0  || this.detail.quantity !== 0){
      this.newOrder.id = this.produit.id;
    }
   const cart =  this.item.allCurrentClientsOrders.find( item =>   item.idClient === this.currentClientId);
   if(cart === undefined){
     this.item.allCurrentClientsOrders.push({idClient: this.currentClientId, orders: [this.newOrder]});
   }else {
   const isInclude = cart.orders.find(item => item.id === this.newOrder.id);
   if(isInclude === undefined){
 const index = this.item.allCurrentClientsOrders.indexOf(cart);
 this.item.allCurrentClientsOrders[index].orders.push(this.newOrder);
   }else{
    const index2 = this.item.allCurrentClientsOrders.indexOf(cart);
     const orderIndex = this.item.allCurrentClientsOrders[index2].orders.indexOf(isInclude);
     this.item.allCurrentClientsOrders[index2].orders[orderIndex]= this.newOrder;
   }
  }

this.item.total += this.montant;

    await this.modalCtrl.dismiss({ montant: this.montant , order:this.newOrder });
  }
  containerSelected(){
    this.container.color = this.container.isChecked? 'secondary': 'light';

  }
  detailSelected(){

    this.detail.color = this.detail.isChecked? 'secondary':'light';

  }
  ngOnInit() {
    this.currentProduct = this.navParam.data.product;
    this.produit = this.currentProduct;
    this.currentClientId = this.navParam.data.id;



  }
  addContainer(){

    if(this.container.quantity < this.produit.availableContainerQuantity && this.container.isChecked){
      this.container.quantity++;
    }
    this.montant = (this.produit.pieceSalePrice* this.detail.quantity) +
                   ( this.produit.containerSalePrice * this.container.quantity);

 }
 addPeice(){
   if(this.detail.quantity < this.produit.availablePieceQuantity && this.detail.isChecked ){
     this.detail.quantity++;
   } else if(this.detail.quantity < ((this.produit.availableContainerQuantity - this.container.quantity)* this.produit.packagingHoles)){
       this.detail.quantity++;
     }
     this.montant = (this.produit.pieceSalePrice* this.detail.quantity) +
     ( this.produit.containerSalePrice * this.container.quantity);
   }



 ionViewWillEnter(){
  this.currentProduct = this.navParam.data.product;

 }
 ionViewDidEnter(){
    this.produit = this.currentProduct;
 }
  reduceContainer(){
    if(this.container.quantity > 0 && this.container.isChecked){
      this.container.quantity--;
    }
    this.montant = (this.produit.pieceSalePrice* this.detail.quantity) +
    ( this.produit.containerSalePrice * this.container.quantity);


  }
  reducePeice(){
    if(this.detail.quantity > 0 && this.detail.isChecked){
      this.detail.quantity--;
    }
    this.montant = (this.produit.pieceSalePrice* this.detail.quantity) +
    ( this.produit.containerSalePrice * this.container.quantity);

  }

}

interface Select{
  isChecked: boolean;
  color: string;
  quantity: number;
}

