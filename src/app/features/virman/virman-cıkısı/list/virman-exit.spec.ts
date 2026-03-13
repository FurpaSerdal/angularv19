import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirmanExit } from './virman-exit';

describe('VirmanExit', () => {
  let component: VirmanExit;
  let fixture: ComponentFixture<VirmanExit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirmanExit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirmanExit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

