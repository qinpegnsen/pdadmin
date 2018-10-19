import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandCourseWareComponent } from './band-course-ware.component';

describe('BandCourseWareComponent', () => {
  let component: BandCourseWareComponent;
  let fixture: ComponentFixture<BandCourseWareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandCourseWareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandCourseWareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
