import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { StatCounterComponent } from './stat-counter.component';

describe('StatCounterComponent', () => {
  let component: StatCounterComponent;
  let fixture: ComponentFixture<StatCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatCounterComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StatCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment value', () => {
    component.value = 3;
    component.increment();
    expect(component.value).toBe(4);
  });

  it('should not increment beyond max', () => {
    component.value = 6;
    component.max = 6;
    component.increment();
    expect(component.value).toBe(6);
  });

  it('should decrement value', () => {
    component.value = 3;
    component.decrement();
    expect(component.value).toBe(2);
  });

  it('should not decrement below min', () => {
    component.value = 1;
    component.min = 1;
    component.decrement();
    expect(component.value).toBe(1);
  });
});