import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, ChangeDetectionStrategy, Component, input, linkedSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-native-select',
	imports: [NgIcon],
	providers: [provideIcons({ lucideChevronDown })],
	host: {
		'data-slot': 'native-select-wrapper',
		'[attr.data-size]': 'size()',
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<select
			class="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent py-1 pr-8 pl-2.5 text-sm shadow-xs transition-[color,box-shadow] outline-none select-none focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:ring-3 data-[size=sm]:h-8"
			data-slot="native-select"
			[attr.data-size]="size()"
			[disabled]="_disabled()"
		>
			<ng-content />
		</select>

		<ng-icon
			name="lucideChevronDown"
			class="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 select-none"
			aria-hidden="true"
			data-slot="native-select-icon"
		/>
	`,
})
export class HlmNativeSelect {
	public readonly size = input<'sm' | 'default'>('default');

	public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

	// TODO update in form control
	protected readonly _disabled = linkedSignal(this.disabled);

	constructor() {
		classes(() => 'group/native-select relative w-fit has-[select:disabled]:opacity-50');
	}
}
