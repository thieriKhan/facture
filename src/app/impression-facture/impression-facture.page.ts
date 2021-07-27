import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { BehaviorSubject, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { FacturesService } from '../services/factures.service';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import {Platform} from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';


export interface Produit {
  produit: string;


}
@Component({
  selector: 'app-impression-facture',
  templateUrl: './impression-facture.page.html',
  styleUrls: ['./impression-facture.page.scss'],
})
export class ImpressionFacturePage implements OnInit {
clientFom: FormGroup;
clients: Observable<any>;
clientSelected: any;
client: Observable<any>;
icon = 'calendar';
content = true;

facturation: Observable<any>;


  constructor(
    private fact: FacturesService,
    private formBuilder: FormBuilder,
    private printer: Printer,
    private platform: Platform,
    private route: Router
  ) {



     }

  ngOnInit() {
    this.icon = 'calendar';
    this.clientFom = this.formBuilder.group(
      {choix: ['']}
    );


  }

  printView(){
    this.icon = this.icon ==='list'? 'calendar': 'list';
    this.content = this.icon =='calendar'? true: false;
  }
  print() {
     if(this.platform.is('android') || this.platform.is('ios') ){
      console.log('mobile');

      this.printMobile();

     }else{
       console.log('other');


      this.printWeb();
     }


     window.location.reload();


  }

  async ionViewWillEnter(){
   this.clients = await  this.fact.getClient();
   }
   async ionViewDidEnter(){
    this.facturation = await this.fact.getFacture(this.clientSelected);
   }


   printMobile(){
     const content = document.getElementById('maTable').innerHTML;


    this.printer.isAvailable().then(
      ()=>{ console.log('printer is available');},
     (error)=>{console.log('printer is not availabe', error);
      }
     );
    const  options: PrintOptions = {
         name: 'MyDocument',
         duplex: true,
         orientation: 'landscape',
         monochrome: false
    };
    this.printer.print(content, options);
   }
   printWeb(){
     const myBody = document.body.innerHTML;

      document.body.innerHTML =  document.getElementsByClassName('list')[0].innerHTML;


     window.print();
     document.body.innerHTML = myBody;

   }

  async select(event){
     const val =event.detail.value;
     console.log(event);
     this.facturation = await this.fact.getFacture(val);
     this.client = await this.fact.getUniqueClient(this.clientSelected);
   }





}


