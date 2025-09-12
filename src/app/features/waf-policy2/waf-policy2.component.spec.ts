import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WafPolicy2Component } from './waf-policy2.component';

describe('WafPolicy2Component', () => {
  let component: WafPolicy2Component;
  let fixture: ComponentFixture<WafPolicy2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WafPolicy2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WafPolicy2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
