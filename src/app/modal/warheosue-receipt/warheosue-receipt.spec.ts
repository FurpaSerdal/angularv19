import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarheosueReceipt } from './warheosue-receipt';

describe('WarheosueReceipt', () => {
  let component: WarheosueReceipt;
  let fixture: ComponentFixture<WarheosueReceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarheosueReceipt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarheosueReceipt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
