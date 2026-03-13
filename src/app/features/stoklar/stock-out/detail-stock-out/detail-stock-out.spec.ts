import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailStockOut } from './detail-stock-out';

describe('DetailStockOut', () => {
  let component: DetailStockOut;
  let fixture: ComponentFixture<DetailStockOut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailStockOut]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailStockOut);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

