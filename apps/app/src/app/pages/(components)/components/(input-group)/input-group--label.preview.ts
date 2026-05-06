import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
	selector: 'spartan-input-group-label-preview',
	imports: [HlmInputGroupImports, HlmIconImports, HlmTooltipImports, HlmLabelImports],
	providers: [provideIcons({ lucideInfo })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'grid w-full max-w-sm gap-6' },
	template: `
		<hlm-input-group>
			<input hlmInputGroupInput id="email" placeholder="spartan" />
			<hlm-input-group-addon>
				<label for="email" hlmLabel>&#64;</label>
			</hlm-input-group-addon>
		</hlm-input-group>

		<hlm-input-group>
			<input hlmInputGroupInput id="email-2" placeholder="spartan-ng@github.com" />
			<hlm-input-group-addon align="block-start">
				<label for="email-2" class="text-foreground" hlmLabel>Email</label>
				<button
					hlmInputGroupButton
					[hlmTooltip]="tooltip"
					variant="ghost"
					aria-label="Help"
					class="ml-auto rounded-full"
					size="icon-xs"
				>
					<ng-icon name="lucideInfo" />
				</button>
				<ng-template #tooltip>We'll use this to send you notifications</ng-template>
			</hlm-input-group-addon>
		</hlm-input-group>
	`,
})
export class InputGroupLabelPreview {}
