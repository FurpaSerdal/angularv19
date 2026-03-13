import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLabel } from './add-label';

describe('AddLabel', () => {
  let component: AddLabel;
  let fixture: ComponentFixture<AddLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

