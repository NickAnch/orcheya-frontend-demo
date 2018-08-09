import { AbstractControl } from '@angular/forms';
import { format, parseNumber, AsYouType } from 'libphonenumber-js';

export const formatNumber = (value: string, phoneControl: AbstractControl) => {
  let number = value.trim();
  const parsedNumber  = parseNumber(number);

  if (number && !number.match(/(^\+)|(^\s\+)/)) {
    number = `+${number}`;
    phoneControl.patchValue(number);
  } else if ('phone' in parsedNumber) {
    const result = format(parsedNumber, 'International');
    const formattedResult = result.split(' ').map((item, index) => {
      if (index === 1) {
        return ` (${item})`;
      } else if (index > 2) {
        return `-${item}`;
      } else {
        return ` ${item}`;
      }
    }).join('').trim();
    phoneControl.patchValue(formattedResult);
  } else {
    const formattedResult = new AsYouType().input(number);
    phoneControl.patchValue(formattedResult);
  }
};
