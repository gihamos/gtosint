import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeagueResultComponent } from './league-result.component';


describe('LeagueResultComponent', () => {
  let component: LeagueResultComponent;
  let fixture: ComponentFixture<LeagueResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeagueResultComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LeagueResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});