import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgorderDetailsComponent } from './msgorder-details.component';

describe('MsgorderDetailsComponent', () => {
  let component: MsgorderDetailsComponent;
  let fixture: ComponentFixture<MsgorderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgorderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgorderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
