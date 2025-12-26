import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HafmkAlinanSiparis } from './hafmk-alinan-siparis';

describe('HafmkAlinanSiparis', () => {
  let component: HafmkAlinanSiparis;
  let fixture: ComponentFixture<HafmkAlinanSiparis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HafmkAlinanSiparis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HafmkAlinanSiparis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
