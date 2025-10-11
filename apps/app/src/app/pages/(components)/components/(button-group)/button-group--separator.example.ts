import { Component } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmButtonGroup, HlmButtonGroupSeparator } from '@spartan-ng/helm/button-group';

@Component({
	selector: 'spartan-button-group-separator',
	imports: [HlmButton, HlmButtonGroup, HlmButtonGroupSeparator],
	template: `
		<div hlmButtonGroup>
			<button hlmBtn variant="secondary" size="sm">Copy</button>
			<hlm-button-group-separator />
			<button hlmBtn variant="secondary" size="sm">Paste</button>
		</div>
	`,
})
export class ButtonGroupSeparator {}
