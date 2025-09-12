import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-waf-policy2',
  standalone: true,
  imports: [NgFor, MatExpansionModule],
  templateUrl: './waf-policy2.component.html',
  styleUrl: './waf-policy2.component.scss',
})
export class WafPolicy2Component {
  wafDetails = [
    {
      Value: 480,
      WAF_POLICY_Enforcement_Mode: 'blocking',
      WAF_Policy: '96.58%',
    },
    {
      Value: 18,
      WAF_POLICY_Enforcement_Mode: 'transparent',
      WAF_Policy: '3.62%',
    },
    {
      Value: 1,
      WAF_POLICY_Enforcement_Mode: 'No policy',
      WAF_Policy: '0.20%',
    },
    {
      Value: 0,
      WAF_POLICY_Enforcement_Mode: null,
      WAF_Policy: '0%',
    },
  ];

  get wafTotal() {
    return this.wafDetails.reduce((sum, item) => sum + item.Value, 0);
  }
}
