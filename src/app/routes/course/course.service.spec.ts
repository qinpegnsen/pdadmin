import {inject, TestBed} from "@angular/core/testing";
import {CourseService} from "../course/course.service";

describe('CoursecatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseService]
    });
  });

  it('should ...', inject([CourseService], (service: CourseService) => {
    expect(service).toBeTruthy();
  }));
});
