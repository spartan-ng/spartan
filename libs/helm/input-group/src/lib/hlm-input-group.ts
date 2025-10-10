import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { provideHlmIconConfig } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-input-group',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		provideHlmIconConfig({
			size: 'sm',
		}),
	],
	template: `
		<ng-content select="hlm-prefix-addon, [hlmPrefixAddon]" />
		<div [class]="_inputWrapperClasses()">
			<ng-content select="hlm-prefix, [hlmPrefix]" />
			<ng-content select="input[hlmInput], textarea[hlmInput]"></ng-content>
			<ng-content select="hlm-suffix, [hlmSuffix]" />
		</div>
		<ng-content select="hlm-suffix-addon, [hlmSuffixAddon]" />
	`,
	host: {
		'[class]': '_wrapperClasses()',
	},
})
export class HlmInputGroup {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly inputWrapperClass = input<ClassValue>('');

	protected readonly _wrapperClasses = computed(() =>
		hlm(
			'shadow-xs group flex w-full items-stretch rounded-md has-[*:disabled]:pointer-events-none has-[*:disabled]:opacity-50 ' +
				// Reset inner input/textarea
				'[&_[hlmInput]]:h-auto [&_[hlmInput]]:flex-1 [&_[hlmInput]]:border-0 [&_[hlmInput]]:bg-transparent [&_[hlmInput]]:px-0 [&_[hlmInput]]:py-0 [&_[hlmInput]]:shadow-none [&_[hlmInput]]:outline-none [&_[hlmInput]]:ring-0 [&_[hlmInput]]:ring-offset-0 [&_textarea[hlmInput]]:min-h-6' +
				this.userClass(),
		),
	);

	protected readonly _inputWrapperClasses = computed(() =>
		hlm(
			'border-input bg-background placeholder:text-muted-foreground focus-within:border-ring focus-within:ring-ring/50 z-20 flex h-auto min-h-9 w-full flex-row gap-1 rounded-md border px-3 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-within:outline-none focus-within:ring-[3px]' +
				// Invalid States
				' has-[>.ng-invalid.ng-touched]:text-destructive/20 dark:[&.ng-invalid.ng-touched]:text-destructive/40 has-[>.ng-invalid.ng-touched]:border-destructive has-[>.ng-invalid.ng-touched]:focus-within:ring-destructive' +
				// Group addon specific
				' group-has-[hlm-prefix-addon,[hlmPrefixAddon]]:rounded-l-none group-has-[hlm-suffix-addon,[hlmSuffixAddon]]:rounded-r-none group-has-[hlm-prefix-addon,[hlmPrefixAddon]]:border-l-0 group-has-[hlm-suffix-addon,[hlmSuffixAddon]]:border-r-0',
			this.inputWrapperClass(),
		),
	);
}
