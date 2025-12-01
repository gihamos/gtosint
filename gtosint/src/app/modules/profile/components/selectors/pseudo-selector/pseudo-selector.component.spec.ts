import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PseudoSelectorComponent } from './pseudo-selector.component';

describe('PseudoSelectorComponent', () => {
  let component: PseudoSelectorComponent;
  let fixture: ComponentFixture<PseudoSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PseudoSelectorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PseudoSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});