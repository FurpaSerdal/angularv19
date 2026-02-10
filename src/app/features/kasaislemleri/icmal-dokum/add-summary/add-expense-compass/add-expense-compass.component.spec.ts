import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpenseCompassComponent } from './add-expense-compass.component';

describe('AddExpenseCompassComponent', () => {
  let component: AddExpenseCompassComponent;
  let fixture: ComponentFixture<AddExpenseCompassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddExpenseCompassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExpenseCompassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
