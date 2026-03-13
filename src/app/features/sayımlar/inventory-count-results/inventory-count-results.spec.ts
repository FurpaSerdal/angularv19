import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryCountResults } from './inventory-count-results';

describe('InventoryCountResults', () => {
  let component: InventoryCountResults;
  let fixture: ComponentFixture<InventoryCountResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryCountResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryCountResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

