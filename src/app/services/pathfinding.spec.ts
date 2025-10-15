import { TestBed } from '@angular/core/testing';

import { Pathfinding } from './pathfinding';

describe('Pathfinding', () => {
  let service: Pathfinding;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pathfinding);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
