import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SlotManagerComponent } from './slot-manager.component';

describe('SlotManagerComponent', () => {
  let component: SlotManagerComponent;
  let fixture: ComponentFixture<SlotManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SlotManagerComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SlotManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});