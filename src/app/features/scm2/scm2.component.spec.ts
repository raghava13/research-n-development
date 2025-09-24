import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scm2Component } from './scm2.component';

describe('Scm2Component', () => {
  let component: Scm2Component;
  let fixture: ComponentFixture<Scm2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scm2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Scm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
