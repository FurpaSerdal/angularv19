import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseSend } from './warehouse-send';

describe('WarehouseSend', () => {
  let component: WarehouseSend;
  let fixture: ComponentFixture<WarehouseSend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseSend]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseSend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

