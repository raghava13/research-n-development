// waf-policy.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

interface WafDetail {
  value: number;
  WAF_POLICY_Enforcement_Mode: string | null;
  WAF_Policy: string;
}

interface WafData {
  WAF: {
    waf_details: WafDetail[];
    waf_total: number;
  };
}

interface WafSummary {
  mode: string;
  policy: number;
  percentage: string;
}

@Component({
  selector: 'app-waf-policy',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './waf-policy.component.html',
  styleUrls: ['./waf-policy.component.scss'],
})
export class WafPolicyComponent implements OnInit {
  wafData: WafData = {
    WAF: {
      waf_details: [
        {
          value: 478,
          WAF_POLICY_Enforcement_Mode: 'blocking',
          WAF_Policy: '95.97%',
        },
        {
          value: 19,
          WAF_POLICY_Enforcement_Mode: 'transparent',
          WAF_Policy: '3.83%',
        },
        {
          value: 0,
          WAF_POLICY_Enforcement_Mode: null,
          WAF_Policy: '0.00%',
        },
        {
          value: 1,
          WAF_POLICY_Enforcement_Mode: 'No policy',
          WAF_Policy: '0.20%',
        },
      ],
      waf_total: 498,
    },
  };

  wafSummary: WafSummary[] = [];
  displayedColumns: string[] = ['mode', 'policy', 'percentage'];
  panelOpenState = false;

  ngOnInit(): void {
    this.generateWafSummary();
  }

  private generateWafSummary(): void {
    this.wafSummary = this.wafData.WAF.waf_details.map((detail) => ({
      mode: detail.WAF_POLICY_Enforcement_Mode || 'Null',
      policy: detail.value,
      percentage: detail.WAF_Policy,
    }));

    // Add grand total
    this.wafSummary.push({
      mode: 'Grand total',
      policy: this.wafData.WAF.waf_total,
      percentage: '100%',
    });
  }

  getModeDisplayName(mode: string): string {
    switch (mode) {
      case 'blocking':
        return 'Blocking';
      case 'transparent':
        return 'Transparent';
      case 'No policy':
        return 'No Policy';
      case 'Null':
        return 'Null';
      case 'Grand total':
        return 'Grand Total';
      default:
        return mode;
    }
  }

  getModeIcon(mode: string): string {
    switch (mode) {
      case 'blocking':
        return 'block';
      case 'transparent':
        return 'visibility';
      case 'No policy':
        return 'policy';
      case 'Null':
        return 'help_outline';
      default:
        return 'info';
    }
  }

  getModeClass(mode: string): string {
    switch (mode) {
      case 'blocking':
        return 'blocking-mode';
      case 'transparent':
        return 'transparent-mode';
      case 'No policy':
        return 'no-policy-mode';
      case 'Null':
        return 'null-mode';
      case 'Grand total':
        return 'total-row';
      default:
        return '';
    }
  }

  getPolicyCount(mode: string): number {
    const item = this.wafSummary.find((summary) => summary.mode === mode);
    return item ? item.policy : 0;
  }

  getPolicyPercentage(mode: string): string {
    const item = this.wafSummary.find((summary) => summary.mode === mode);
    return item ? item.percentage : '0%';
  }
}
