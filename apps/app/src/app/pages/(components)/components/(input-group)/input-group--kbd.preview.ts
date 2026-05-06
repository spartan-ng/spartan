import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';

@Component({
	selector: 'spartan-input-group-kbd',
	imports: [HlmInputGroupImports, NgIcon, HlmKbdImports],
	providers: [provideIcons({ lucideSearch })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'max-w-sm' },
	template: `
		<hlm-input-group>
			<input hlmInputGroupInput placeholder="Search..." />
			<hlm-input-group-addon>
				<ng-icon name="lucideSearch" />
			</hlm-input-group-addon>
			<hlm-input-group-addon align="inline-end">
				<kbd hlmKbd>⌘K</kbd>
			</hlm-input-group-addon>
		</hlm-input-group>
	`,
})
export class InputGroupKbd {}
