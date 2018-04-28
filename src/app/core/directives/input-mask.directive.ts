import {
  Directive, HostListener, Input,
} from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import { formatNumber } from '../../shared/helpers/phone-formatter.helper';

@Directive({
  selector: 'input[appMask]'
})
export class InputMaskDirective {

  @Input() appMask: FormControl;

  constructor() {}

  @HostListener('input', ['$event.target.value'])

  public onChange(event): void {
    formatNumber(event, this.appMask)
  }
}
