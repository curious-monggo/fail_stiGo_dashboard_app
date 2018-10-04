import { TestBed, inject } from '@angular/core/testing';

import { StrandService } from './strand.service';

describe('StrandService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StrandService]
    });
  });

  it('should be created', inject([StrandService], (service: StrandService) => {
    expect(service).toBeTruthy();
  }));
});
