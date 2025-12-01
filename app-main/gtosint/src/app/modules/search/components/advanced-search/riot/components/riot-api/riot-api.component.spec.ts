import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiotFormComponent } from './riot-api.component';

describe('RiotFormComponent', () => {
  let component: RiotFormComponent;
  let fixture: ComponentFixture<RiotFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiotFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RiotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});