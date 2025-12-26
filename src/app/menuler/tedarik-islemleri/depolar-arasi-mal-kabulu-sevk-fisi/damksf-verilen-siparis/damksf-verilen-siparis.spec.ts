import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamksfVerilenSiparis } from './damksf-verilen-siparis';

describe('DamksfVerilenSiparis', () => {
  let component: DamksfVerilenSiparis;
  let fixture: ComponentFixture<DamksfVerilenSiparis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DamksfVerilenSiparis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DamksfVerilenSiparis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
