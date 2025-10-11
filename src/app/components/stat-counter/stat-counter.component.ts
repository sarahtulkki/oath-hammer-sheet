import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-stat-counter',
  standalone: false,
  template: `
    <div class="stat-counter-container">
      <ion-button 
        fill="clear" 
        size="small" 
        (click)="decrement()"
        [disabled]="value <= min">
        <ion-icon name="remove-circle-outline"></ion-icon>
      </ion-button>
      
      <div class="stat-value">{{ value }}</div>
      
      <ion-button 
        fill="clear" 
        size="small" 
        (click)="increment()"
        [disabled]="value >= max">
        <ion-icon name="add-circle-outline"></ion-icon>
      </ion-button>
    </div>
  `,
  styles: [`
    .stat-counter-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      min-width: 40px;
      text-align: center;
      padding: 4px 8px;
      background: var(--ion-color-light);
      border-radius: 8px;
    }

    ion-button {
      --padding-start: 4px;
      --padding-end: 4px;
    }

    ion-icon {
      font-size: 28px;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StatCounterComponent),
      multi: true
    }
  ]
})
export class StatCounterComponent implements ControlValueAccessor {
  @Input() min = 1;
  @Input() max = 6;
  @Input() value = 1;
  @Output() valueChange = new EventEmitter<number>();

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  increment() {
    if (this.value < this.max) {
      this.value++;
      this.emitValue();
    }
  }

  decrement() {
    if (this.value > this.min) {
      this.value--;
      this.emitValue();
    }
  }

  private emitValue() {
    this.valueChange.emit(this.value);
    this.onChange(this.value);
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    if (value !== undefined && value !== null) {
      this.value = Math.max(this.min, Math.min(this.max, value));
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}