import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFoodChecksComponent } from './add-food-checks.component';

describe('AddFoodChecksComponent', () => {
  let component: AddFoodChecksComponent;
  let fixture: ComponentFixture<AddFoodChecksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFoodChecksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFoodChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

