import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { BrnCommandInput } from '@spartan-ng/brain/command';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-command-input',
	imports: [HlmInputGroupImports, NgIcon, BrnCommandInput],
	providers: [provideIcons({ lucideSearch })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'command-input-wrapper',
	},
	template: `
		<hlm-input-group class="spartan-command-input-group">
			<input
				brnCommandInput
				data-slot="command-input"
				class="spartan-command-input outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
				[id]="inputId()"
				[placeholder]="placeholder()"
			/>

			<hlm-input-group-addon>
				<ng-icon name="lucideSearch" class="spartan-command-input-icon" />
			</hlm-input-group-addon>
		</hlm-input-group>
	`,
})
export class HlmCommandInput {
	public readonly inputId = input<string | undefined>();
	public readonly placeholder = input<string>('');

	constructor() {
		classes(() => 'spartan-command-input-wrapper');
	}
}
