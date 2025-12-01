import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverfastApiComponent } from './overfast-api.component';

describe('OverfastApiComponent', () => {
  let component: OverfastApiComponent;
  let fixture: ComponentFixture<OverfastApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverfastApiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverfastApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});