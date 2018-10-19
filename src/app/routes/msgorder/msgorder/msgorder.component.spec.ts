import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgorderComponent } from './msgorder.component';

describe('MsgorderComponent', () => {
  let component: MsgorderComponent;
  let fixture: ComponentFixture<MsgorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
