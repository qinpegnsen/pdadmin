import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsaddComponent } from './goodsadd.component';

describe('GoodsaddComponent', () => {
  let component: GoodsaddComponent;
  let fixture: ComponentFixture<GoodsaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
