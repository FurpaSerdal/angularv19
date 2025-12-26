import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsfsPrerakendeSatisFaturaliSevk } from './psfs-prerakende-satis-faturali-sevk';

describe('PsfsPrerakendeSatisFaturaliSevk', () => {
  let component: PsfsPrerakendeSatisFaturaliSevk;
  let fixture: ComponentFixture<PsfsPrerakendeSatisFaturaliSevk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsfsPrerakendeSatisFaturaliSevk]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsfsPrerakendeSatisFaturaliSevk);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
