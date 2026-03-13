import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseSaleOrderDetailComponent } from './detail';

describe('WarehouseSaleOrderDetailComponent', () => {
  let component: WarehouseSaleOrderDetailComponent;
  let fixture: ComponentFixture<WarehouseSaleOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseSaleOrderDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseSaleOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

