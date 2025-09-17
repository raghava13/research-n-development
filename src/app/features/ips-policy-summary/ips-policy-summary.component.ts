import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

export interface IpsPolicyData {
  decRuleAction: string | null;
  ipsUrl: string;
  value: number;
}

@Component({
  selector: 'app-ips-policy-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './ips-policy-summary.component.html',
  styleUrls: ['./ips-policy-summary.component.scss'],
})
export class IpsPolicySummaryComponent implements OnInit {
  displayedColumns: string[] = ['number', 'ipsRule', 'url', 'percentage'];

  ipsData: IpsPolicyData[] = [
    { decRuleAction: 'decrypt', ipsUrl: '99.39%', value: 1472 },
    { decRuleAction: null, ipsUrl: '0.54%', value: 8 },
    { decRuleAction: 'no-decrypt', ipsUrl: '0.07%', value: 1 },
  ];

  totalValue: number = 1481;

  constructor() {}

  ngOnInit(): void {}

  getDisplayValue(decRuleAction: string | null): string {
    if (decRuleAction === null) {
      return 'Null';
    }
    return decRuleAction;
  }

  getTotalPercentage(): string {
    return '100%';
  }
}

