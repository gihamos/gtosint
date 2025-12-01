import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverfastResultComponent } from './overfast-result.component';

describe('OverfastResultComponent', () => {
  let component: OverfastResultComponent;
  let fixture: ComponentFixture<OverfastResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverfastResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverfastResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});