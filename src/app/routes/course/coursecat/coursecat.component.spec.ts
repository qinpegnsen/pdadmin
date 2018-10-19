import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodscatComponent } from './goodscat.component';

describe('GoodscatComponent', () => {
  let component: GoodscatComponent;
  let fixture: ComponentFixture<GoodscatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodscatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodscatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
