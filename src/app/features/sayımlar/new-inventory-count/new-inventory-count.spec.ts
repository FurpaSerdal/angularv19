import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInventoryCount } from './new-inventory-count';

describe('NewInventoryCount', () => {
  let component: NewInventoryCount;
  let fixture: ComponentFixture<NewInventoryCount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewInventoryCount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewInventoryCount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

