import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeItemName } from './home-item-name';

describe('HomeItemName', () => {
  let component: HomeItemName;
  let fixture: ComponentFixture<HomeItemName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeItemName],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeItemName);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
