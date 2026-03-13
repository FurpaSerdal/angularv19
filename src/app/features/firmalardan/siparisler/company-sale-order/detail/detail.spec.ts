import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySaleOrderDetailComponent } from './detail';

describe('CompanySaleOrderDetailComponent', () => {
  let component: CompanySaleOrderDetailComponent;
  let fixture: ComponentFixture<CompanySaleOrderDetailComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanySaleOrderDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySaleOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

