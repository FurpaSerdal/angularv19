import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertToEWaybillComponent } from './convert-to-ewaybill-component';

describe('ConvertToEWaybillComponent', () => {
  let component: ConvertToEWaybillComponent;
  let fixture: ComponentFixture<ConvertToEWaybillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertToEWaybillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvertToEWaybillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

