import { LoginService } from "./../services/login.service";
import { ItemsService } from './../services/items.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { BehaviorSubject, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { FacturesService } from '../services/factures.service';
// import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { Platform, ModalController, AlertController, IonCheckbox, IonItemSliding,
   ToastController, LoadingController, GestureController } from '@ionic/angular';
import { finalize, tap, catchError } from 'rxjs/operators';
import { Router, RouterOutlet } from '@angular/router';
import { PrintPreviewComponent } from './print-preview/print-preview.component';
import { Client, Facture, PostData, UpdateFacture } from '../containers';
import { StorageService } from '../services/storage.service';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailComponent } from '../components/order-detail/order-detail.component';
import { ProduitComponent } from '../components/produit/produit.component';
import { IonRouterOutlet } from '@ionic/angular';
import { ModalBaseComponent } from '../components/modal-base/modal-base.component';




export interface Produit {
  produit: string;


}
@Component({
  selector: 'app-impression-facture',
  templateUrl: './impression-facture.page.html',
  styleUrls: ['./impression-facture.page.scss'],
})
export class ImpressionFacturePage implements OnInit {
alertInterface;
clientFom: FormGroup;
trackBy;
testons: Facture[];
clients: Observable<any>;
clientSelected: any;
client: Observable<any>;
icon = 'list';
content = true;
test;

deleteItem = false;
selectedC;
idC;
selected: PostData = {
    customerId: 0,
    paymentMode: '',
    comment: '',
    createdBy: parseInt( this.log.getUser().phone),
    orderItems: [],
};
unposted: PostData[];


facturation: Observable<Facture[]>;


  constructor(
    private routerOutlet: IonRouterOutlet,
    private fact: FacturesService,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private storage: StorageService,


    private item: ItemsService,
    private log: LoginService

  ) {
    this.alertInterface = {
      cssClass: 'alert',
      backdropDismiss: true,
      animated: true
    };

     }

  ngOnInit() {
    this.icon = 'list';
    this.clientFom = this.formBuilder.group(
      {choix: ['']}
    );

  }

  printView(){
    this.icon = this.icon ==='list'? 'calendar': 'list';
    this.content = this.icon ==='list'? true: false;
  }

  changed(event){

    if(event.detail.checked){
      this.deleteItem = false;

      if(!this.fact.printItemID.includes(event.detail.value)){
      this.fact.printItemID.push(event.detail.value);
      }
    }else{
      this.fact.printItemID.splice(this.fact.printItemID.indexOf(event.detail.value),1);
    }

  }


  async ionViewWillEnter(){

   const client = (await this.fact.getClient())
     .pipe(
       tap((data: Client[]) => {
         const dat = data.find((item: Client) => String(item.id) === this.idC);
         if(dat){
           this.selectedC = dat.name;
         }

       })
     );
   this.clients = client;

   }

  async ionViewDidEnter(){
     this.fact.selectedclient = this.clientSelected;


   }

  async edit2(){
     const modal =  await this.modalCtrl.create(
       {
         component: ProduitComponent
       }
     );
     modal.present();
   }





  async select(event){
     const val = event.detail.value;
     this.fact.currentClient = val;
     this.unposted =  await this.storage.get('unposted');
     this.fact.pending = this.unposted.length;
     this.selected = this.unposted.find(item=> item.customerId = val);


   }
   async getProduct(id: string){
    return this.item.getProduitUnique(id);

   }



  // async delete(id, slide: IonItemSliding){
  //   slide.close();
  //   const alert = await  this.alertCtrl.create({
  //     header: 'Confirmation',
  //     cssClass: 'alert',
  //     message: 'voulez vous vraiment suprimer cette commande?',
  //     buttons: [
  //       {
  //         text: 'NON',
  //         role: 'cancel'
  //       },
  //       {
  //         text: 'OUI',
  //         handler: async (data)=>{
  //           const toast = this.toastC.create({
  //             message: 'desole cette facture n\' pas ete supprime',
  //             cssClass: 'errorToast'
  //           });
  //           const load =  await this.loadC.create(
  //             {
  //               spinner: 'bubbles',
  //               cssClass: 'loadingClass',

  //             }
  //           );
  //           load.present();
  //           const del = ();
  //           del.subscribe(
  //             async ()=>
  //        {

  //        },
  //        async (error)=>{
  //          (await toast).present();
  //        if(error.status !== 403){
  //          let dt: any[] = [];
  //           dt = JSON.parse( await this.storage.get('undeleted')) || [];
  //           if(!dt.includes(id)){
  //             dt.push(id);
  //           }
  //         await this.storage.set('undeleted',JSON.stringify(dt));
  //        }
  //        }
  //           );


  //         }
  //       }
  //     ]
  //    });

  //    await alert.present();



  //  }




}


