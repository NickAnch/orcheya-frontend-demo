import { AbstractControl } from '@angular/forms';

export function ValidateLatin(control: AbstractControl) {
  const regex = /^\w+$/;
  return !control.value.match(regex) ? { validLatin: true } : null;
}
