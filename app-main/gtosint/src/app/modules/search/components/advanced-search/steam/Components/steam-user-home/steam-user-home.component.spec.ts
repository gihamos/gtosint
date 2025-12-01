import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SteamUserHomeComponent } from './steam-user-home.component';

describe('SteamUserHomeComponent', () => {
  let component: SteamUserHomeComponent;
  let fixture: ComponentFixture<SteamUserHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SteamUserHomeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SteamUserHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});