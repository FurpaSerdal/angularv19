import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoreExpensesComponent } from './add-store-expenses.component';

describe('AddStoreExpensesComponent', () => {
  let component: AddStoreExpensesComponent;
  let fixture: ComponentFixture<AddStoreExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStoreExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStoreExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

