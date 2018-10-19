import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {TimetableComponentAdd} from "./timetableAdd.component";


describe('TimetableComponent', () => {
  let component: TimetableComponentAdd;
  let fixture: ComponentFixture<TimetableComponentAdd>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimetableComponentAdd ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableComponentAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
