import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCreditCardsComponent } from './add-credit-cards.component';

describe('AddCreditCardsComponent', () => {
  let component: AddCreditCardsComponent;
  let fixture: ComponentFixture<AddCreditCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCreditCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCreditCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

