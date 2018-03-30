import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: number): string {
    if (value == null) {
      return '';
    }
    if (value <= 0) {
      return '';
    }
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    const hour = (hours > 1) ? hours + 'h ' : hours + 'h ';
    const min = (minutes > 0) ? minutes + 'm' : '';
    return hour + min;
  }

}
