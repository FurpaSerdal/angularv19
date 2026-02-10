import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStockOut } from './new-stock-out';

describe('NewStockOut', () => {
  let component: NewStockOut;
  let fixture: ComponentFixture<NewStockOut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewStockOut]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewStockOut);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
