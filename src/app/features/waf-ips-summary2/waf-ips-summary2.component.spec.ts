import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WafIpsSummary2Component } from './waf-ips-summary2.component';

describe('WafIpsSummary2Component', () => {
  let component: WafIpsSummary2Component;
  let fixture: ComponentFixture<WafIpsSummary2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WafIpsSummary2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WafIpsSummary2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
