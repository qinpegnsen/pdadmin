import { TestBed, inject } from '@angular/core/testing';

import { EnterpriseService } from './enterprise.service';

describe('EnterpriseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnterpriseService]
    });
  });

  it('should ...', inject([EnterpriseService], (service: EnterpriseService) => {
    expect(service).toBeTruthy();
  }));
});
