import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({selector: 'spartan-rich-filter-field-label',
imports: [HlmButtonGroupImports, HlmLabelImports],
changeDetection: ChangeDetectionStrategy.OnPush,
host: { style: 'display: contents' },
template: `
		<div hlmButtonGroupText class="rounded-r-none border-r-0">
			<label class="w-content" hlmLabel [for]="for()">{{ label() }}</label>
		</div>
	`})
export class FieldLabel {
	public readonly label = input.required<string>();
	public readonly for = input.required<string>();
}
