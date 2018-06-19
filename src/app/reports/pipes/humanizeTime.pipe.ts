import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanizeTime'
})
export class HumanizeTimePipe implements PipeTransform {

  transform(value: number): string {
    if (value === null || value <= 0 ) {
      return '0m';
    }

    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - hours * 3600) / 60);

    const h = hours > 0 ? hours + 'h ' : '';
    const m = minutes + 'm';

    return h + m;
  }

}
