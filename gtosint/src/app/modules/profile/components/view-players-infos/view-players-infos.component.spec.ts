import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewPlayersInfosComponent } from './view-players-infos.component';

describe('ViewPlayersInfosComponent', () => {
  let component: ViewPlayersInfosComponent;
  let fixture: ComponentFixture<ViewPlayersInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPlayersInfosComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ViewPlayersInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});