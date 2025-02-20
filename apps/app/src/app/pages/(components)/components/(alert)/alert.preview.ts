import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBox } from '@ng-icons/lucide';
import {
	HlmAlertDescriptionDirective,
	HlmAlertDirective,
	HlmAlertIconDirective,
	HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';

@Component({
	selector: 'spartan-alert-preview',
	imports: [
		HlmAlertDirective,
		HlmAlertDescriptionDirective,
		HlmAlertIconDirective,
		HlmAlertTitleDirective,
		NgIcon,
		HlmIconDirective,
	],
	providers: [provideIcons({ lucideBox })],
	template: `
		<div hlmAlert>
			<ng-icon hlm hlmAlertIcon name="lucideBox" />
			<h4 hlmAlertTitle>Introducing spartan/ui!</h4>
			<p hlmAlertDesc>
				spartan/ui is made up of unstyled UI providers, the spartan/ui/brain.
				<br />
				On top we add spartan/ui/helm(et) with shadcn-like styles.
			</p>
		</div>
	`,
})
export class AlertPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideBox } from '@ng-icons/lucide';

@Component({
  selector: 'spartan-alert-preview',
  standalone: true,
  imports: [
    HlmAlertDirective,
    HlmAlertDescriptionDirective,
    HlmAlertIconDirective,
    HlmAlertTitleDirective,
    HlmIconDirective,
  ],
  providers: [provideIcons({ lucideBox })],
  template: \`
    <div hlmAlert>
      <ng-icon hlm hlmAlertIcon name="lucideBox" />
      <h4 hlmAlertTitle>Introducing spartan/ui!</h4>
      <p hlmAlertDesc>
        spartan/ui is made up of unstyled UI providers, the spartan/ui/brain.<br />
        On top we add spartan/ui/helm(et) with shadcn-like styles.
      </p>
    </div>
  \`,
})
export class AlertPreviewComponent {}
`;

export const defaultImports = `
import {
  HlmAlertDescriptionDirective,
  HlmAlertDirective,
  HlmAlertIconDirective,
  HlmAlertTitleDirective,
} from '@spartan-ng/ui-alert-helm';
`;

export const defaultSkeleton = `
    <div hlmAlert>
      <ng-icon hlm hlmAlertIcon name="lucideBox" />
      <h4 hlmAlertTitle>Introducing spartan/ui!</h4>
      <p hlmAlertDesc>
        spartan/ui is made up of unstyled UI providers, the spartan/ui/brain.<br />
        On top we add spartan/ui/helm(et) with shadcn-like styles.
      </p>
    </div>
`;
