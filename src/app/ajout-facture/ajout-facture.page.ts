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
  clients: Observable<any>;
  clientsCached: Promise<any>;
  produits: Observable<any>;
  produitSelect: any;
  clientSelect: any;

  constructor(
    private formBuilder: FormBuilder,
    private fact: FacturesService,
    private alertC: AlertController,
    private router: Router,
    private network: Network,
    private toast: ToastController,
    private storage: StorageService) { }

 async ngOnInit() {
  this.init();

window.addEventListener('online', ()=>{

});





    this.clients = await this.fact.getClient() ;


    this.produits = await this.fact.getProduit();
  }
  init(){
    this.ajoutForm = this.formBuilder.group({
      client: [''],
      produit: [''],
      quantite: ['']
    }
    );
  }
   async ionViewWillEnter(){
    const toast = await this.toast.create({
      message: 'vous etes hors ligne',
      duration: 2000
    });

    window.addEventListener('online', async (event)=>{

      const data =JSON.parse(await  this.storage.get('failed'))|| [];

        this.failedPost(data);



      console.log('online', event);
      console.log(data);
    });
    window.addEventListener('offline', (event)=>{
      console.log('offline', event);
      toast.present();

    });

  this.clients = await this.fact.getClient();
  this.produits = await this.fact.getProduit();

  }




 async onSubmit(){
  const form =  await this.ajoutForm.value;
  console.log(form);
  console.log(form.quantite);
   if(form.quantite <1){
     console.log('this.form is not valid');
   }else{
    const alert = await  this.alertC.create(
      {
        cssClass: 'alertctrl',
        message: 'Voulez vous enregistrer commande',
        header: 'confirmation',
        buttons: [{
          text: 'cancel',
           role: 'cancel'
              },
              {
                text :'ok',
                handler: ()=>{
                  this.post(form);
                }
              }
          ]
      }
    );
  alert.present();

     }

  }





 async post(form){

  const toastError = await  this.toast.create(
    {
      message:'desole la commande n\' pas ete enregistre ',
      duration: 5000
    }
  );
  const formated= {facture_client: form.client, produit: form.produit.id, quantite: form.quantite};
  console.log(formated);
    this.obs = await this.fact.postFacture(formated);

 this.obs.subscribe(
   ()=> this.router.navigate(['nav-bar/impression-facture']),
  async (error)=>{
      let state = [];

      state = JSON.parse( await  this.storage.get('failed'))|| [];
      state.push(formated);
      await this.storage.set('failed',    JSON.stringify(state));
     toastError.present();
   }
 );


  }


  async failedPost(data: any[]){
    if(data.length > 0){
      for( let i = 0 ; i <= data.length ; i++){
        console.log('current data', data[i]);
        this.obs = await this.fact.postFacture(data[i]);
        this.obs.subscribe(
          async (val)=> {
            data.splice(i);
          }
        );
      }
      await this.storage.set('failed',    JSON.stringify(data));
    }

  }
}

