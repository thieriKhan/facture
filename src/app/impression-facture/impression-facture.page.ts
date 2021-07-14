import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { BehaviorSubject, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { FacturesService } from '../services/factures.service';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import {Platform} from '@ionic/angular'


export interface Produit {
  produit: string;


}
@Component({
  selector: 'app-impression-facture',
  templateUrl: './impression-facture.page.html',
  styleUrls: ['./impression-facture.page.scss'],
})
export class ImpressionFacturePage implements OnInit {
finalSub: Subject<any> = new Subject<any>();
values: Observable<any> = this.finalSub.asObservable();
clientFom: FormGroup;
clentSelected: string;
factSub: Subscription;
allFacts: Observable<Produit[]>;
solution: Subject<any> = new Subject<any>();
mysolution: Observable<any> = this.solution.asObservable();
columns =[
  {name: 'numero'},
  {name: 'produit'}
];


facturation: Observable<any>;


  constructor(
    private fact: FacturesService,
    private formBuilder: FormBuilder,
    private printer: Printer,
    private platform: Platform
  ) {



     }

  ngOnInit() {
    this.clientFom = this.formBuilder.group(
      {choix: ['']}
    );


  }
  print() {
     if(this.platform.is('android') || this.platform.is('ios') ){
      console.log('mobile');

      this.printMobile();

     }else{
       console.log('other');

      this.printWeb();
     }


  }

  async ionViewWillEnter(){

    this.facturation =  await this.fact.getFacture(1);

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
         monochrome: true
    };
    this.printer.print(content, options);
   }
   printWeb(){
     const myBody = document.body.innerHTML;
     document.body.innerHTML = document.getElementById('maTable').innerHTML;
     window.print();
     document.body.innerHTML = myBody;


   }





}


