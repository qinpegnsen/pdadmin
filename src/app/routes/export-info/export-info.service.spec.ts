import { TestBed, inject } from '@angular/core/testing';

import { ExportInfoService } from './export-info.service';

describe('ExportInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportInfoService]
    });
  });

  it('should be created', inject([ExportInfoService], (service: ExportInfoService) => {
    expect(service).toBeTruthy();
  }));
});
