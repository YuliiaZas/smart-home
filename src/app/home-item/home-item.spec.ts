import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeItem } from './home-item';

describe('HomeItem', () => {
  let component: HomeItem;
  let fixture: ComponentFixture<HomeItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeItem],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
