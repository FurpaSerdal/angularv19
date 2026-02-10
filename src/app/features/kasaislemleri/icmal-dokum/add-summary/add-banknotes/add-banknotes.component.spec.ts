import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBanknotesComponent } from './add-banknotes.component';

describe('AddBanknotesComponent', () => {
  let component: AddBanknotesComponent;
  let fixture: ComponentFixture<AddBanknotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBanknotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBanknotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
