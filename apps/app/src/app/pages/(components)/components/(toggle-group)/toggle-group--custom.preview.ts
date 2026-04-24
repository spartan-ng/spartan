import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { hlmCode } from '@spartan-ng/helm/typography';

@Component({
	selector: 'spartan-toggle-group-custom',
	imports: [HlmToggleGroupImports, HlmFieldImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-field>
			<label hlmFieldLabel>Font Weight</label>
			<hlm-toggle-group variant="outline" value="all" spacing="2" size="lg" [(value)]="fontWeight">
				@for (weight of fontWeights; track $index) {
					<button
						hlmToggleGroupItem
						[value]="weight.value"
						[attr.aria-label]="weight.label"
						class="flex size-16 flex-col items-center justify-center rounded-xl"
					>
						<span class="text-2xl leading-none" [class]="weight.class">Aa</span>
						<span class="text-muted-foreground text-xs">{{ weight.label }}</span>
					</button>
				}
			</hlm-toggle-group>
			<hlm-field-description>
				Use
				<code class="${hlmCode}">font-{{ fontWeight() }}</code>
				to set the font weight.
			</hlm-field-description>
		</hlm-field>
	`,
})
export class ToggleGroupCustomPreview {
	public fontWeights = [
		{ label: 'Light', value: 'light', class: 'font-light' },
		{ label: 'Normal', value: 'normal', class: 'font-normal' },
		{ label: 'Medium', value: 'medium', class: 'font-medium' },
		{ label: 'Bold', value: 'bold', class: 'font-bold' },
	];

	public fontWeight = signal('normal');
}
