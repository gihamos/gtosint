import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrResultComponent } from './cr-result.component';

describe('CrResultComponent', () => {
  let component: CrResultComponent;
  let fixture: ComponentFixture<CrResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrResultComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CrResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});