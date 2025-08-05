import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCardSingle } from './home-card-single';

describe('HomeCardSingle', () => {
  let component: HomeCardSingle;
  let fixture: ComponentFixture<HomeCardSingle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCardSingle],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeCardSingle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
