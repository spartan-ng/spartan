import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-input-group-label-preview',
	imports: [HlmInputGroupImports, HlmIconImports, HlmTooltipImports, HlmLabelImports],
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
			<input hlmInputGroupInput id="email" placeholder="spartan" />
			<div hlmInputGroupAddon>
				<label for="email" hlmLabel>&#64;</label>
			</div>
		</div>

		<div hlmInputGroup>
			<input hlmInputGroupInput id="email-2" placeholder="spartan-ng@github.com" />
			<div hlmInputGroupAddon align="block-start">
				<label for="email-2" class="text-foreground" hlmLabel>Email</label>
				<button
					hlmInputGroupButton
					hlmTooltipTrigger="We'll use this to send you notifications"
					variant="ghost"
					aria-label="Help"
					class="ml-auto rounded-full"
					size="icon-xs"
				>
					<ng-icon name="lucideInfo" />
				</button>
			</div>
		</div>
	`,
})
export class InputGroupLabelPreview {}
