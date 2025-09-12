import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { IpsPolicySummaryComponent } from './ips-policy-summary.component';

describe('IpsPolicySummaryComponent', () => {
  let component: IpsPolicySummaryComponent;
  let fixture: ComponentFixture<IpsPolicySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpsPolicySummaryComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IpsPolicySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display IPS policy data', () => {
    expect(component.ipsData.length).toBe(3);
    expect(component.totalValue).toBe(1481);
  });

  it('should format display value correctly', () => {
    expect(component.getDisplayValue('decrypt')).toBe('decrypt');
    expect(component.getDisplayValue(null)).toBe('Null');
    expect(component.getDisplayValue('no-decrypt')).toBe('no-decrypt');
  });

  it('should return correct total percentage', () => {
    expect(component.getTotalPercentage()).toBe('100%');
  });
});
