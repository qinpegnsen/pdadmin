import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgAddOrEditComponent } from './msg-add-or-edit.component';

describe('MsgAddOrEditComponent', () => {
  let component: MsgAddOrEditComponent;
  let fixture: ComponentFixture<MsgAddOrEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgAddOrEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgAddOrEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
