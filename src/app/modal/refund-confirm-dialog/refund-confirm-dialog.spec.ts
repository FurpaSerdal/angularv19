import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundConfirmDialog } from './refund-confirm-dialog';

describe('RefundConfirmDialog', () => {
  let component: RefundConfirmDialog;
  let fixture: ComponentFixture<RefundConfirmDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundConfirmDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundConfirmDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
