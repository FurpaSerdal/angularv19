import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseOrderComponent } from './warehouse-order';

describe('WarehouseOrderComponent', () => {
  let component: WarehouseOrderComponent;
  let fixture: ComponentFixture<WarehouseOrderComponent>; 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarehouseOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

