import { Facture, Client, Produit } from "./../containers";
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { catchError, finalize, tap } from 'rxjs/operators';
import { FacturesService } from '../services/factures.service';
import { Observable } from 'rxjs';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { StorageService } from '../services/storage.service';


@Component({
  selector: 'app-ajout-facture',
  templateUrl: './ajout-facture.page.html',
  styleUrls: ['./ajout-facture.page.scss'],
})
export class AjoutFacturePage implements OnInit {
  ajoutForm: FormGroup;
  obs: Observable<any>;
  clients: Observable<Client[]>;
  clientsCached: Promise<any>;
  produits: Observable<Produit[]>;
  alertInterface;
  list= ["bonjour",'bonsoit', 'demain'];

  term: string;

  constructor(
    private formBuilder: FormBuilder,
    private fact: FacturesService,
    private alertC: AlertController,
    private router: Router,
    private network: Network,
    private toast: ToastController,
    private storage: StorageService,
    private loadC: LoadingController) {


      this.alertInterface = {
        cssClass: 'alertClass',
        backdropDismiss: true,
        animated: true
      };
     }

 async ngOnInit() {
  // this.init();
  // const toast = await this.toast.create({
  //   message: 'vous etes hors ligne',
  //   cssClass: 'errorToast',
  //   duration: 2000
  // });

    this.clients = await this.fact.getClient() ;


    // this.produits = await this.fact.getProduit();
  }
 async ionViewWillEnter(){
    this.clients = await this.fact.getClient();
  }

  // init(){
  //   this.ajoutForm = this.formBuilder.group({
  //     client: [''],
  //     produit: [''],
  //     quantite: ['']
  //   }
  //   );
  // }

  addProduct(id: string){
    this.router.navigate(['nav-bar/items', id])
  }
//    async ionViewWillEnter(){

//   this.clients = await this.fact.getClient();
//   this.produits = await this.fact.getProduit();

//   }

//  async onSubmit(){
//   const form =  await this.ajoutForm.value;
//   console.log('form', form);

//    if(form.quantite <1){
//      return 0;
//    }else{
//     const alert = await  this.alertC.create(
//       {
//         cssClass: 'alert',
//         subHeader: 'Voulez vous  ajouter ce produit?',
//         message:'<strong>- valider</strong> pour proceder a la validation <br/>',
//         header: 'confirmation',
//         buttons: [
//           {

//           text: 'non',
//            role: 'cancel'
//               },
//               {

//                 text :'oui',
//                 handler: ()=>{
//                   this.post(form);
//                   // this.init();
//                 }
//               },
//               {
//                 text :'valider',
//                 handler: async ()=>{
//                   await this.post(form);
//                   // this.init();
//                   this.router.navigate(['nav-bar/impression-facture/', form.customer.id]);
//                 }
//               }
//           ]
//       }
//     );
//   alert.present();

//      }

//   }





//  async post(form: Facture){

//   const toastError = await  this.toast.create(
//     {
//       cssClass: 'errorToast',
//       message:'Erreur: desole la commande n\' pas ete enregistre ',
//       duration: 5000
//     }
//   );
//   const toastsuccess = await  this.toast.create(
//     {
//       cssClass: 'successToast',
//       message:' la commande a  ete enregistre  avec success',
//       duration: 5000
//     }
//   );

//   const load = await this.loadC.create(
//     {
//       cssClass: 'loadingClass',
//       spinner: 'bubbles'
//     }

//   );
//    load.present();


//   this.obs = await (await this.fact.postFacture(form)).pipe(
//     finalize(
//       ()=>{ load.dismiss(); }
//     )
//   );

//   this.obs.subscribe(
//     ()=>{
//       toastsuccess.present();

//      },
//    async (error)=>{
//        let state = [];

//        state = JSON.parse( await  this.storage.get('unposted'))|| [];
//        state.push(form);
//        await this.storage.set('unposted',    JSON.stringify(state));
//       toastError.present();
//     }
//   );



//   }


}

