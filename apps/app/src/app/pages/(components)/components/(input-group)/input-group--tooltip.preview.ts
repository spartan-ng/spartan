import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-input-group-tooltip-preview',
	imports: [HlmInputGroupImports, HlmTooltipImports, HlmIconImports],
	providers: [
		provideIcons({
			lucideInfo,
		}),
	],
	host: {
		class: 'grid w-full max-w-sm gap-6',
	},
	template: `
		<div hlmInputGroup>
			<input hlmInputGroupInput placeholder="Enter password" type="password" />
			<div hlmInputGroupAddon align="inline-end">
				<button
					hlmInputGroupButton
					[hlmTooltip]="'Password must be at least 8 characters'"
					variant="ghost"
					aria-label="Info"
					size="icon-xs"
				>
					<ng-icon name="lucideInfo" />
				</button>
			</div>
		</div>
		<div hlmInputGroup>
			<input hlmInputGroupInput placeholder="Your email address" />
			<div hlmInputGroupAddon align="inline-end">
				<button hlmInputGroupButton [hlmTooltip]="tooltip" variant="ghost" aria-label="Info" size="icon-xs">
					<ng-icon name="lucideInfo" />
				</button>
				<ng-template #tooltip>We'll use this to send you notifications</ng-template>
			</div>
		</div>
		<div hlmInputGroup>
			<input hlmInputGroupInput placeholder="Enter API key" />
			<div hlmInputGroupAddon>
				<button
					hlmInputGroupButton
					[hlmTooltip]="'Click for help with API keys'"
					position="left"
					variant="ghost"
					aria-label="Info"
					size="icon-xs"
				>
					<ng-icon name="lucideInfo" />
				</button>
			</div>
		</div>
	`,
})
export class InputGroupTooltipPreview {}
