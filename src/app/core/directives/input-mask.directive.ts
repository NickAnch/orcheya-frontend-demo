import {
  Directive, HostListener, Input,
  ElementRef, OnInit, EventEmitter,
  Output
} from '@angular/core';

const placeholders = {
  'A': '^[a-zA-ZA-zА-яЁё]',
  '0': '\\d'
};

const keys = {
  'BACKSPACE': 8,
  'LEFT': 37,
  'RIGHT': 39,
  'DEL': 46,
  'ENTER': 13,
};

interface IState {
  value: string;
}

@Directive({
  selector: 'input[appMask]'
})
export class InputMaskDirective implements OnInit {

  private state: IState;

  @Input() appMask: any;
  @Output() ngModelChange = new EventEmitter<string>();

  constructor(private element: ElementRef) {
    this.state = {
      value: this.getValue()
    };
  }

  @HostListener('input')
  public onChange(): void {
    this.applyMask(this.getClearValue(this.getValue()));
  }

  @HostListener('keypress', ['$event'])
  public onKeyPress(event): void {
    if (!this.appMask) {
      return;
    }

    const key = this.getKey(event);
    if (key === keys.BACKSPACE || key === keys.LEFT || key === keys.RIGHT) {
      return;
    }

    const cursorPosition = this.getCursorPosition();
    const regexp = this.createRegExp(cursorPosition);
    if (
      regexp != null && !regexp.test(event.key)
      || this.getValue().length >= this.appMask.length
    ) {
      if (key === keys.ENTER) {
        return;
      }
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event): void {
    const key = this.getKey(event);
    if (
      (key === keys.BACKSPACE || key === keys.DEL)
      && this.getClearValue(this.getValue()).length === 1
    ) {
      this.setValue('');
      this.state.value = '';
      this.ngModelChange.emit('');
    }
  }

  public ngOnInit(): void {
    this.applyMask(this.getClearValue(this.getValue()));
  }

  private getKey(event): number {
    return event.keyCode || event.charCode;
  }

  private applyMask(value): void {
    if (!this.appMask) {
      return;
    }

    let newValue = '';
    let maskPosition = 0;

    if (
      this.getClearValue(value).length > this.getClearValue(this.appMask).length
    ) {
      this.setValue(this.state.value);
      return;
    }

    for (let i = 0; i < value.length; i++) {
      const current = value[i];

      const regexp = this.createRegExp(maskPosition);
      if (regexp != null) {
        if (!regexp.test(current)) {
          this.setValue(this.state.value);
          break;
        }
        newValue += current;
      } else if (this.appMask[maskPosition] === current) {
        newValue += current;
      } else {
        newValue += this.appMask[maskPosition];
        i--;
      }

      maskPosition++;
    }

    const nextMaskElement = this.appMask[maskPosition];
    if (
      value.length
      && nextMaskElement != null
      && /^[-\/\\^$#&@№:<>_\^!*+?.()|\[\]{}]/.test(nextMaskElement)
    ) {
      newValue += nextMaskElement;
    }

    const oldValue = this.state.value;
    const cursorPosition = this.getCursorPosition();
    this.setValue(newValue);
    this.state.value = newValue;

    if (oldValue.length >= cursorPosition) {
      this.setCursorPosition(cursorPosition);
    }

  }

  private createRegExp(position): RegExp | null {
    if (!this.appMask) {
      return;
    }

    if (this.appMask[position] == null) {
      return;
    }

    const currentSymbol = this.appMask[position].toUpperCase();
    const objKeys = Object.keys(placeholders);
    const searchPosition = objKeys.indexOf(currentSymbol);
    if (searchPosition >= 0) {
      return new RegExp(placeholders[keys[searchPosition]], 'gi');
    }
    return null;
  }

  private getValue(): string {
    return this.element.nativeElement.value;
  }

  private getClearValue(value): string {
    return value.trim().replace(/[-\/\\^$#&@№:<>_\^!*+?.()|\[\]{}]/gi, '');
  }

  private setValue(value: string): void {
    this.element.nativeElement.value = value;
  }

  private getCursorPosition(): number {
    return this.element.nativeElement.selectionStart;
  }

  private setCursorPosition(start: number, end: number = start): void {
    this.element.nativeElement.setSelectionRange(start, end);
  }

}
