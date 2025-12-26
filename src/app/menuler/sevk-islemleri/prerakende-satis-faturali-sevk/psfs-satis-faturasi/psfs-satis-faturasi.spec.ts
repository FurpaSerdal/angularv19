import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsfsSatisFaturasi } from './psfs-satis-faturasi';

describe('PsfsSatisFaturasi', () => {
  let component: PsfsSatisFaturasi;
  let fixture: ComponentFixture<PsfsSatisFaturasi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsfsSatisFaturasi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsfsSatisFaturasi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
