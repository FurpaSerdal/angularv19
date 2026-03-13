import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundConfirmDialogComponent } from './refund-confirm-dialog';

describe('RefundConfirmDialog', () => {
  let component: RefundConfirmDialogComponent;
  let fixture: ComponentFixture<RefundConfirmDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [  RefundConfirmDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

