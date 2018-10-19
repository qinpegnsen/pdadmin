import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandCourseComponent } from './band-course.component';

describe('BandCourseComponent', () => {
  let component: BandCourseComponent;
  let fixture: ComponentFixture<BandCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
