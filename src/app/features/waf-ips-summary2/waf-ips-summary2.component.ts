import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

interface SecurityMetric {
  name: string;
  onPremPercentage: number;
  onPremFailing: number;
  onPremTotal: number;
  cloudPercentage: number;
  cloudFailing: number;
  cloudTotal: number;
  logo?: string;
}

@Component({
  selector: 'app-waf-ips-summary2',
  standalone: true,
  imports: [DecimalPipe, NgFor, NgIf],
  templateUrl: './waf-ips-summary2.component.html',
  styleUrl: './waf-ips-summary2.component.scss',
})
export class WafIpsSummary2Component {
  platforms: SecurityMetric[] = [
    {
      name: 'SentinelOne',
      onPremPercentage: 98,
      onPremFailing: 150,
      onPremTotal: 6814,
      cloudPercentage: 94,
      cloudFailing: 762,
      cloudTotal: 12540,
    },
    {
      name: 'Qualys',
      onPremPercentage: 95,
      onPremFailing: 358,
      onPremTotal: 6814,
      cloudPercentage: 87,
      cloudFailing: 1618,
      cloudTotal: 12540,
    },
  ];
}
