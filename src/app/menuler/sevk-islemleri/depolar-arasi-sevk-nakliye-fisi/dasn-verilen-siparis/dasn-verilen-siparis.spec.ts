import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasnVerilenSiparis } from './dasn-verilen-siparis';

describe('DasnVerilenSiparis', () => {
  let component: DasnVerilenSiparis;
  let fixture: ComponentFixture<DasnVerilenSiparis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DasnVerilenSiparis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DasnVerilenSiparis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
