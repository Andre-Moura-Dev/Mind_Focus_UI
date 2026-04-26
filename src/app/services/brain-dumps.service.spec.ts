import { TestBed } from '@angular/core/testing';

import { BrainDumpsService } from './brain-dumps.service';

describe('BrainDumpsService', () => {
  let service: BrainDumpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrainDumpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
