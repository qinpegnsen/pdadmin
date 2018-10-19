import { TestBed, inject } from '@angular/core/testing';
import {TimetableServiceAdd} from "./timetableAdd.service";


describe('TimetableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimetableServiceAdd]
    });
  });

  it('should be created', inject([TimetableServiceAdd], (service: TimetableServiceAdd) => {
    expect(service).toBeTruthy();
  }));
});
