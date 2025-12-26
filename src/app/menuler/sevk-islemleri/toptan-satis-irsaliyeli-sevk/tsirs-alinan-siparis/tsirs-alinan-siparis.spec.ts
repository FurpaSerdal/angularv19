import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TsirsAlinanSiparis } from './tsirs-alinan-siparis';

describe('TsirsAlinanSiparis', () => {
  let component: TsirsAlinanSiparis;
  let fixture: ComponentFixture<TsirsAlinanSiparis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TsirsAlinanSiparis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TsirsAlinanSiparis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
