import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnlineSalesChecksComponent } from './add-online-sales-checks.component';

describe('AddOnlineSalesChecksComponent', () => {
  let component: AddOnlineSalesChecksComponent;
  let fixture: ComponentFixture<AddOnlineSalesChecksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOnlineSalesChecksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOnlineSalesChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
