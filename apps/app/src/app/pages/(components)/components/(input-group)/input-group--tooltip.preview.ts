import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-input-group-tooltip-preview',
	imports: [HlmInputGroupImports, HlmTooltipImports, HlmIconImports],
	providers: [provideIcons({ lucideInfo })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'grid w-full max-w-sm gap-6' },
	template: `
		<hlm-input-group>
			<input hlmInputGroupInput placeholder="Enter password" type="password" />
			<hlm-input-group-addon align="inline-end">
				<button
					hlmInputGroupButton
					[hlmTooltip]="'Password must be at least 8 characters'"
					variant="ghost"
					aria-label="Info"
					size="icon-xs"
				>
					<ng-icon name="lucideInfo" />
				</button>
			</hlm-input-group-addon>
		</hlm-input-group>
		<hlm-input-group>
			<input hlmInputGroupInput placeholder="Your email address" />
			<hlm-input-group-addon align="inline-end">
				<button hlmInputGroupButton [hlmTooltip]="tooltip" variant="ghost" aria-label="Info" size="icon-xs">
					<ng-icon name="lucideInfo" />
				</button>
				<ng-template #tooltip>We'll use this to send you notifications</ng-template>
			</hlm-input-group-addon>
		</hlm-input-group>
		<hlm-input-group>
			<input hlmInputGroupInput placeholder="Enter API key" />
			<hlm-input-group-addon>
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
			</hlm-input-group-addon>
		</hlm-input-group>
	`,
})
export class InputGroupTooltipPreview {}
