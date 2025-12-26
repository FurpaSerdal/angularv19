import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TafmkVerilenSiparis } from './tafmk-verilen-siparis';

describe('TafmkVerilenSiparis', () => {
  let component: TafmkVerilenSiparis;
  let fixture: ComponentFixture<TafmkVerilenSiparis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TafmkVerilenSiparis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TafmkVerilenSiparis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
