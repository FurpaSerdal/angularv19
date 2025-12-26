import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasfAlinanSiparis } from './dasf-alinan-siparis';

describe('DasfAlinanSiparis', () => {
  let component: DasfAlinanSiparis;
  let fixture: ComponentFixture<DasfAlinanSiparis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DasfAlinanSiparis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DasfAlinanSiparis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
