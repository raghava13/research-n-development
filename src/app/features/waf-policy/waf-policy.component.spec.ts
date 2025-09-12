import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WafPolicyComponent } from './waf-policy.component';

describe('WafPolicyComponent', () => {
  let component: WafPolicyComponent;
  let fixture: ComponentFixture<WafPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WafPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WafPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
