import { StorageService } from "./../services/storage.service";

import { Client, Produit, Order } from "./../containers";
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IonCheckbox, ModalController } from "@ionic/angular";
import { Observable, Subscription } from 'rxjs';
import { ProduitComponent } from '../components/produit/produit.component';
import { ModalBaseComponent } from '../components/modal-base/modal-base.component';
import { FacturesService } from '../services/factures.service';
import { ItemsService } from '../services/items.service';
import { timeStamp } from "console";
import { tap } from "rxjs/operators";
import { stringify } from "querystring";

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

  constructor(
    private modalCtrl: ModalController,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private fact: FacturesService,
    private item: ItemsService,
    private storage: StorageService
    ) { }

 async  ngOnInit() {
   this.command = [];
   this.montant =  parseInt(await this.storage.get('montant'))|| 0;
   this.command = JSON.parse(await this.storage.get( 'command')) || [];

  // this.itemSub =  (await this.item.getProduit()).subscribe(
  //   (data: Produit[])=>{
  //     this.item.allProducts = data;
  //   }
  // );

  }

  async ionViewWillEnter(){

    this.itemSub  = (await this.item.getProduit()).pipe(
      tap(data => this.item.allProducts = data)
    ).subscribe(
      (items)=>{
        this.item.itemsBSub.next(items);
      }
    );

    this.idClient = this.activatedRoute.snapshot.paramMap.get('id');
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
  if(data){
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
     this.storage.set('montant', this.montant.toString());
     this.storage.set('command', JSON.stringify(this.command) );
     this.storage.set('allOrders', JSON.stringify(this.item.allCurrentClientsOrders) );

  }





  }
  async print() {
    this.item.currentClintid = this.idClient;

    const detailPage = await this.modalCtrl.create({
      component: ModalBaseComponent,
      componentProps: { total: this.montant, allData : this.command }

   });
     detailPage.present();
   const data =  await   detailPage.onWillDismiss();

   if (data.data?.done){
    this.command = [];
    this.montant = 0;

   }


  }

}
interface Command {
  montant: number;
  order: Order;
}
