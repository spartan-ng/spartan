import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-input-basic',
	imports: [HlmInputImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'min-w-xs sm:min-w-sm' },
	template: `
		<input hlmInput placeholder="Enter text" />
	`,
})
export class InputBasic {}
