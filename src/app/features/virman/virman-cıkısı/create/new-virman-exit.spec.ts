import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVirmanExit } from './new-virman-exit';

describe('NewVirmanExit', () => {
  let component: NewVirmanExit;
  let fixture: ComponentFixture<NewVirmanExit>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewVirmanExit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewVirmanExit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

