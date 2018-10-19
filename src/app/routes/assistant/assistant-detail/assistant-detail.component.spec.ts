import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantDetailComponent } from './assistant-detail.component';

describe('AssistantDetailComponent', () => {
  let component: AssistantDetailComponent;
  let fixture: ComponentFixture<AssistantDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
