import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEmpty } from './home-empty';

describe('HomeEmpty', () => {
  let component: HomeEmpty;
  let fixture: ComponentFixture<HomeEmpty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeEmpty],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeEmpty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
