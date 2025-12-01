import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClashRoyaleFormComponent } from './cr-api.component';

describe('ClashRoyaleFormComponent', () => {
  let component: ClashRoyaleFormComponent;
  let fixture: ComponentFixture<ClashRoyaleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClashRoyaleFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClashRoyaleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});