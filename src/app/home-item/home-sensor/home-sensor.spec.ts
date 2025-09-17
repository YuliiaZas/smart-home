import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sensor } from './home-sensor';

describe('Sensor', () => {
  let component: Sensor;
  let fixture: ComponentFixture<Sensor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sensor],
    }).compileComponents();

    fixture = TestBed.createComponent(Sensor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
