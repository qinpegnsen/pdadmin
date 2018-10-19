import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCourseWareComponent } from './upload-course-ware.component';

describe('UploadCourseWareComponent', () => {
  let component: UploadCourseWareComponent;
  let fixture: ComponentFixture<UploadCourseWareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadCourseWareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCourseWareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
