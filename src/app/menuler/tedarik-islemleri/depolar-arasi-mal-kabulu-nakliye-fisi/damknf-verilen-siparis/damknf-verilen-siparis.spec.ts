import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamknfVerilenSiparis } from './damknf-verilen-siparis';

describe('DamknfVerilenSiparis', () => {
  let component: DamknfVerilenSiparis;
  let fixture: ComponentFixture<DamknfVerilenSiparis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamknfVerilenSiparis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DamknfVerilenSiparis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
