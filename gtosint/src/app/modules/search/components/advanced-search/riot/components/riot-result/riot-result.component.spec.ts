import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiotResultComponent } from './riot-result.component';

describe('RiotResultComponent', () => {
  let component: RiotResultComponent;
  let fixture: ComponentFixture<RiotResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiotResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RiotResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});