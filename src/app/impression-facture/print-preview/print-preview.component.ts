import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FacturesService } from '../../services/factures.service';


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

  constructor( private fact: FacturesService) { }

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
      console.log('tot', tot, data);
      this.totalsub.next(tot);

    })

  );


  }


}
