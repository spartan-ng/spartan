// eslint-disable -- auto-generated
// prettier-ignore -- auto-generated
/*
DO NOT EDIT THIS FILE!!
It is automatically generated by the extract-primitive-code generator.
Instead, edit the `(alert).preview.ts` file or the generator itself.
Run `pnpm run generate-snippets` to update this file.
*/

export const alertDestructiveCode = `
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTriangleAlert } from '@ng-icons/lucide';
import {
	HlmAlertDescriptionDirective,
	HlmAlertDirective,
	HlmAlertIconDirective,
	HlmAlertTitleDirective,
} from '@spartan-ng/helm/alert';
import { HlmIconDirective } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-alert-destructive',
	imports: [
		HlmAlertDirective,
		HlmAlertDescriptionDirective,
		HlmAlertIconDirective,
		HlmAlertTitleDirective,
		NgIcon,
		HlmIconDirective,
	],
	providers: [provideIcons({ lucideTriangleAlert })],
	template: \`
		<div hlmAlert variant="destructive">
			<ng-icon hlm hlmAlertIcon name="lucideTriangleAlert" />
			<h4 hlmAlertTitle>Unexpected Error</h4>
			<p hlmAlertDesc>Your session has expired. Please log in again.</p>
		</div>
	\`,
})
export class AlertDestructiveComponent {}
`;

export const defaultCode = `
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBox } from '@ng-icons/lucide';
import {
	HlmAlertDescriptionDirective,
	HlmAlertDirective,
	HlmAlertIconDirective,
	HlmAlertTitleDirective,
} from '@spartan-ng/helm/alert';
import { HlmIconDirective } from '@spartan-ng/helm/icon';

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
	template: \`
		<div hlmAlert>
			<ng-icon hlm hlmAlertIcon name="lucideBox" />
			<h4 hlmAlertTitle>Introducing spartan/ui!</h4>
			<p hlmAlertDesc>
				spartan/ui is made up of unstyled UI providers, the spartan/ui/brain.
				<br />
				On top we add spartan/ui/helm(et) with shadcn-like styles.
			</p>
		</div>
	\`,
})
export class AlertPreviewComponent {}
`;
