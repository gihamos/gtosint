import { ComponentFixture, TestBed } from '@angular/core/testing';import { SteamHomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: SteamHomeComponent;
  let fixture: ComponentFixture<SteamHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamHomeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SteamHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});