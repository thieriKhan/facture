import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms'
import { catchError, finalize } from 'rxjs/operators';
import { FacturesService } from '../services/factures.service';
import { Observable } from 'rxjs';
import { Produit } from '../impression-facture/impression-facture.page';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-ajout-facture',
  templateUrl: './ajout-facture.page.html',
  styleUrls: ['./ajout-facture.page.scss'],
})
export class AjoutFacturePage implements OnInit {
  ajoutForm: FormGroup;
  obs: Observable<any>;
  clients :Observable<any>;
  produits : Observable<any>;
  produitSelect: any;
  clientSelect: any;

  constructor(
    private formBuilder: FormBuilder,
    private fact: FacturesService,
    private alertC: AlertController) { }

  ngOnInit() {
    this.init();
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
  this.clients = await this.fact.getClient();
  this.produits = await this.fact.getProduit();
  }


 async onSubmit(){

  const alert = await  this.alertC.create(
    {
      cssClass: 'primary',
      message: 'voulez vous vraiment enregistrer cette commande',
      header: 'confirmation',
      buttons: [{
        text: 'cancel',
         role: 'cancel'
            },
            {
              text :'ok',
              handler: ()=>{
                this.post();
              }
            }
        ]
    }
  );
  alert.present();


  //  this.obs.pipe(
  //     catchError(
  //       (err : any) => {
  //         console.log('there was an error', err);
  //       }
  //     )
  //   )

  }

 async post(){

    const form =  await this.ajoutForm.value;
    console.log(form);
     if(form.quantite <1){
       console.log('this.form is not valid');
     }else{
       console.log('valid');
         const formated= {facture_client: form.client, produit: form.produit.id, quantite: form.quantite};
         console.log(formated);
           this.obs = await this.fact.postFacture(formated);

        this.obs.subscribe();

       }
       console.log('form submited');
  }
}
