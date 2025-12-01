import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchLocalComponent } from './search-local.component';

describe('SearchLocalComponent', () => {
  let component: SearchLocalComponent;
  let fixture: ComponentFixture<SearchLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchLocalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});