import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface ProductStatus {
  name: string; // e.g. 'SentinelOne' or 'Qualys'
  logo?: string; // optional URL or asset path to logo
  onPrem: {
    percent: number; // 0..100
    failing: number; // count failing
    total: number; // total count
  };
  cloud: {
    percent: number;
    failing: number;
    total: number;
  };
}

@Component({
  selector: 'app-waf-ips-summary',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './waf-ips-summary.component.html',
  styleUrl: './waf-ips-summary.component.scss',
})
export class WafIpsSummaryComponent {
  // Accept an array of two products (left and right)
  @Input() products: ProductStatus[] = [
    {
      name: 'SentinelOne',
      logo: '',
      onPrem: { percent: 98, failing: 150, total: 6814 },
      cloud: { percent: 94, failing: 762, total: 12540 },
    },
    {
      name: 'Qualys',
      logo: '',
      onPrem: { percent: 95, failing: 358, total: 6814 },
      cloud: { percent: 87, failing: 1618, total: 12540 },
    },
  ];

  // Helper to return width clamp
  barWidth(percent: number): string {
    const p = Math.max(0, Math.min(100, percent));
    return p + '%';
  }
}
