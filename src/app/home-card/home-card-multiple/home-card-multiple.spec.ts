import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCardMultiple } from './home-card-multiple';

describe('HomeCardMultiple', () => {
  let component: HomeCardMultiple;
  let fixture: ComponentFixture<HomeCardMultiple>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCardMultiple],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeCardMultiple);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
