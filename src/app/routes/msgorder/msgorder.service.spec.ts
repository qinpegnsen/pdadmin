import { TestBed, inject } from '@angular/core/testing';

import { MsgorderService } from './msgorder.service';

describe('MsgorderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MsgorderService]
    });
  });

  it('should ...', inject([MsgorderService], (service: MsgorderService) => {
    expect(service).toBeTruthy();
  }));
});
