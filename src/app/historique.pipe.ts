import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'historique'
})
export class HistoriquePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
