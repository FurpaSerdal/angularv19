import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGiftChecksComponent } from './add-gift-checks.component';

describe('AddGiftChecksComponent', () => {
  let component: AddGiftChecksComponent;
  let fixture: ComponentFixture<AddGiftChecksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGiftChecksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGiftChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
