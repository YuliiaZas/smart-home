import { TestBed } from '@angular/core/testing';

import { UserDashboards } from './user-dashboards';

describe('UserDashboards', () => {
  let service: UserDashboards;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDashboards);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
