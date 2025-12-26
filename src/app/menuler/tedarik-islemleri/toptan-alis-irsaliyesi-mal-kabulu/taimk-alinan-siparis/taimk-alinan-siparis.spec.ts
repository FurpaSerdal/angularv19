import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaimkAlinanSiparis } from './taimk-alinan-siparis';

describe('TaimkAlinanSiparis', () => {
  let component: TaimkAlinanSiparis;
  let fixture: ComponentFixture<TaimkAlinanSiparis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaimkAlinanSiparis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaimkAlinanSiparis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
