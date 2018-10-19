import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseWareComponent } from './course-ware.component';

describe('CourseWareComponent', () => {
  let component: CourseWareComponent;
  let fixture: ComponentFixture<CourseWareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseWareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseWareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
