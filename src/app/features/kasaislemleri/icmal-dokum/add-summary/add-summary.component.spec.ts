import {  ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSummaryComponent } from './add-summary.component';

describe('AddSummaryComponent', () => {
  let component: AddSummaryComponent;
  let fixture: ComponentFixture<AddSummaryComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ AddSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
