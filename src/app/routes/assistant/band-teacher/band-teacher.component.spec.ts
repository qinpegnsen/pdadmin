import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandTeacherComponent } from './band-teacher.component';

describe('BandTeacherComponent', () => {
  let component: BandTeacherComponent;
  let fixture: ComponentFixture<BandTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
