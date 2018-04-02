import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanizeTime'
})
export class HumanizeTimePipe implements PipeTransform {

  transform(value: number): string {
    if (value == null) {
      return '0m';
    }
    if (value <= 0) {
      return '0m';
    }
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    const hour = (hours > 1) ? hours + 'h ' : hours + 'h ';
    const min = (minutes > 0) ? minutes + 'm' : '';
    return hour + min;
  }

}
