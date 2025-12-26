import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsirsAlisFaturasi } from './psirs-alis-faturasi';

describe('PsirsAlisFaturasi', () => {
  let component: PsirsAlisFaturasi;
  let fixture: ComponentFixture<PsirsAlisFaturasi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsirsAlisFaturasi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsirsAlisFaturasi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
