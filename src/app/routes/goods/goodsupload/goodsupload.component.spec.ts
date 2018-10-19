import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsuploadComponent } from './goodsupload.component';

describe('GoodsuploadComponent', () => {
  let component: GoodsuploadComponent;
  let fixture: ComponentFixture<GoodsuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
