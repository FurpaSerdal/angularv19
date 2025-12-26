import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsirsPrerakendeSatisIrsaliyeliSevk } from './psirs-prerakende-satis-irsaliyeli-sevk';

describe('PsirsPrerakendeSatisIrsaliyeliSevk', () => {
  let component: PsirsPrerakendeSatisIrsaliyeliSevk;
  let fixture: ComponentFixture<PsirsPrerakendeSatisIrsaliyeliSevk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsirsPrerakendeSatisIrsaliyeliSevk]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsirsPrerakendeSatisIrsaliyeliSevk);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
