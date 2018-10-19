import { TestBed, inject } from '@angular/core/testing';

import { MsgTemplateService } from './msg-template.service';

describe('MsgTemplateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsgTemplateService]
    });
  });

  it('should ...', inject([MsgTemplateService], (service: MsgTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
