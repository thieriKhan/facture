import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';

import { map, tap } from 'rxjs/operators';
import { FacturesService } from '../../services/factures.service';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import {Platform} from '@ionic/angular';


@Component({
  selector: 'app-print-preview',
  templateUrl: './print-preview.component.html',
  styleUrls: ['./print-preview.component.scss'],
})
export class PrintPreviewComponent implements OnInit {
  facturation: Observable<any>;
  totalsub: Subject<any>= new Subject();
  total: Observable<any> = this.totalsub.asObservable();
  date = Date.now();

  constructor(
     private fact: FacturesService, 
     private platform: Platform, 
     private printer: Printer
    ) { }

 async ngOnInit() {
  const client = await this.fact.selectedclient;


  this.facturation = await (await this.fact.getFacture(client)).pipe(

    map(
      data => data.filter(item => this.fact.printItemID.includes(item.id.toString() ))
    ),
    tap((data)=>{
      let tot = 0;
      for(let i of data){
        tot  += i.montant  * i.quantite ;

      }

      this.totalsub.next(tot);

    })

  );


  }

  print(){
 // previous implementation of print function

     if(this.platform.is('android') || this.platform.is('ios') ){
      this.printMobile();
     }else{
      this.printWeb();
     }
     window.location.reload();
  }




  printMobile(){
    const content =document.getElementsByClassName('print')[0].innerHTML;
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
    document.body.innerHTML =  document.getElementsByClassName('print')[0].innerHTML;
     window.print();
     document.body.innerHTML = myBody;

   }


}
