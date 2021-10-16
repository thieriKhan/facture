import { StorageService } from './../services/storage.service';

import { Client, Produit, Order } from './../containers';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IonCheckbox, ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { ProduitComponent } from '../components/produit/produit.component';
import { ModalBaseComponent } from '../components/modal-base/modal-base.component';
import { FacturesService } from '../services/factures.service';
import { ItemsService } from '../services/items.service';
import { timeStamp } from 'console';
import { tap } from 'rxjs/operators';
import { stringify } from 'querystring';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  currentOrder: Order[];
  command: Command[];

  items: Observable<any>;
  montant = 0;
  currentData;
  image='./assets/bg1.jpg';
  currentClient: Observable< string>;
  getOrder: Order ;
  itemSub: Subscription = new Subscription();
  produits$: Observable<Produit[]> = this.item.itemsBSub.asObservable();
  term: string;
  idClient;
  allProducts: Produit[];

  constructor(
    private modalCtrl: ModalController,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private fact: FacturesService,
    private item: ItemsService,
    private storage: StorageService,
    private log: LoginService
    ) { }

 async  ngOnInit() {
   this.allProducts =await this.storage.get('products');
   if (this.allProducts === null || this.allProducts === undefined){   
    const products = await this.item.getProduit();
    products.subscribe(
    data => this.allProducts = data
  );
   }
        
  
 
  this.idClient = this.activatedRoute.snapshot.paramMap.get('id');
   this.log.setUser((await this.storage.get('userData')).phone);
  


  // this.itemSub =  (await this.item.getProduit()).subscribe(
  //   (data: Produit[])=>{
  //     this.item.allProducts = data;
  //   }
  // );



  }

  async getComand(){
          this.allProducts =await this.storage.get('products');
   if (this.allProducts === null || this.allProducts === undefined){   
    const products = await this.item.getProduit();
    products.subscribe(
    data => this.allProducts = data
  );
   }
    this.idClient = this.activatedRoute.snapshot.paramMap.get('id');
     this.command = [];
  //  this.montant = await this.storage.get('montant')|| 0;
  //  this.command = await this.storage.get('command');
   const command  = await this.storage.get( 'allOrders');
   if(command != null || command != undefined) {
      const order: Order[] =  command.find(cmd => cmd.idClient=== this.idClient )?.orders || [];
    if(order.length !== 0 ){

      for (let i of order) {
       const prod =  this.allProducts?.find(item=> item.id === i.id);
       const containerPrice = prod.containerSalePrice;
        const piecePrice = prod.pieceSalePrice;
      const montant = (i.containerQuantity * containerPrice) + (i.pieceQuantity *piecePrice);
      this.command.push({montant, order: i});
    }


    }else{
     this.command = [];
    }
  }else{
    this.command = [];
  }
  
  }


  async ionViewWillEnter(){

  await this.getComand();

  this.montant = 0;
  for (let i of this.command) {
    this.montant += i.montant;

  }





    this.log.setUser((await this.storage.get('userData')).phone);
    this.itemSub  = (await this.item.getProduit()).pipe(
      tap(data => this.item.allProducts = data)
    ).subscribe(
      (items)=>{
        this.item.itemsBSub.next(items);
      }
    );

    this.currentClient = (await this.fact.getUniqueClient(this.idClient)).pipe(
      tap((data: string)=> {
        this.item.currentClient = data;
      })
    );
  }

  async select(product: Produit){
  const modal = await  this.modalCtrl.create({
      component: ProduitComponent,
      componentProps:{id: this.idClient ,product}
    });
    modal.present();
  const { data} =  await  modal.onWillDismiss();
  if(data != undefined){
    this.currentData = data;
    const isInclude = this.command.find(item=> item.order.id === data.order.id);
    if(isInclude === undefined ){
     this.command.push(this.currentData);
    }else{
      this.command[ this.command.indexOf(isInclude)] = data;
    }
    this.montant = this.command.reduce((prev , curr)=> {
      const com = {montant : 0, order:{id: ' ', containerQuantity: 0, pieceQuantity: 0}};;
      prev.montant += curr.montant;
      com.montant= prev.montant;
      return  com;
     }).montant;
     this.storage.set('montant', this.montant);
     this.storage.set('command',this.command );
     this.storage.set('allOrders',this.item.allCurrentClientsOrders);

  }





  }
  ionViewDidLeave(){
    this.command = []
   
  }
  async print() {
    this.item.currentClintid = this.idClient;

    const detailPage = await this.modalCtrl.create({
      component: ModalBaseComponent,
      componentProps: { total: this.montant, allData : this.command }

   });
     detailPage.present();
   const data =  await   detailPage.onWillDismiss();
   this.getComand();

   if(data.data?.total){
     this.montant = data.data.total; 
   }

   if (data.data?.done){
     const allCmd = await this.storage.get('allOrders');
     if( allCmd != null || allCmd != undefined){
       const removeCmd = allCmd.filter(item => item.idClient !== this.idClient);
       this.storage.set('allOrders', removeCmd);
       }
     
    
    this.command = [];
    this.montant = 0;

   }


  }

}


interface Command {
  montant: number;
  order: Order;
}
