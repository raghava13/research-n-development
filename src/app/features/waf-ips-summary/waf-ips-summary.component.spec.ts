import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WafIpsSummaryComponent } from './waf-ips-summary.component';

describe('WafIpsSummaryComponent', () => {
  let component: WafIpsSummaryComponent;
  let fixture: ComponentFixture<WafIpsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WafIpsSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WafIpsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
