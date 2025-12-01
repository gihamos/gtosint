import { ComponentFixture, TestBed } from '@angular/core/testing';import { GameUserViewComponent } from './game-user-view.component';

describe('GameUserViewComponent', () => {
  let component: GameUserViewComponent;
  let fixture: ComponentFixture<GameUserViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameUserViewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GameUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});