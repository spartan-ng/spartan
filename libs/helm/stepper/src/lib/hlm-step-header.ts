import { CdkStepHeader, StepState } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, numberAttribute } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCircleAlert, lucidePencil } from '@ng-icons/lucide';
import { ButtonVariants, buttonVariants } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmStepLabel } from './hlm-step-label';
import { HlmLabelPosition } from './hlm-stepper';
import { injectHlmStepperConfig } from './stepper.token';

export type HlmStepperIndicatorMode = 'number' | 'state' | 'icon';

@Component({
	selector: 'hlm-step-header',
	imports: [NgTemplateOutlet, HlmIconImports],
	providers: [provideIcons({ lucideCheck, lucideCircleAlert, lucidePencil })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class:
			'group inline-flex shrink-0 outline-none items-center gap-2 touch-manipulation transition-opacity data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
		'[class.flex-col]': 'labelPosition() === "bottom"',
		'[class.text-center]': 'labelPosition() === "bottom"',
		'[attr.data-disabled]': 'disabled() ? "true" : null',
	},
	template: `
		<span aria-hidden="true" hlmBtn [class]="_indicatorClass()">
			@if (_iconName(); as icon) {
				<ng-icon hlm [name]="icon" size="sm" />
			} @else {
				<span>{{ index() + 1 }}</span>
			}
		</span>

		<span
			class="flex min-w-0 touch-manipulation flex-col truncate text-sm font-medium"
			[class.text-destructive]="state() === 'error'"
		>
			@if (_templateLabel(); as templateLabel) {
				<ng-container [ngTemplateOutlet]="templateLabel.template" />
			} @else if (_stringLabel(); as stringLabel) {
				{{ stringLabel }}
			}

			@if (_showOptionalLabel()) {
				<span class="text-muted-foreground text-xs">Optional</span>
			}

			@if (_showErrorLabel()) {
				<span class="text-destructive text-xs">{{ errorMessage() }}</span>
			}
		</span>
	`,
})
export class HlmStepHeader extends CdkStepHeader {
	protected readonly _config = injectHlmStepperConfig();

	public readonly state = input<StepState>('number');
	public readonly label = input<HlmStepLabel | string | null>(null);
	public readonly errorMessage = input('');
	public readonly index = input(0, { transform: numberAttribute });
	public readonly selected = input(false, { transform: booleanAttribute });
	public readonly reached = input(false, { transform: booleanAttribute });
	public readonly active = input(false, { transform: booleanAttribute });
	public readonly optional = input(false, { transform: booleanAttribute });
	public readonly disabled = input(false, { transform: booleanAttribute });
	public readonly icon = input<string | null>(null);
	public readonly indicatorMode = input<HlmStepperIndicatorMode>(this._config.defaultIndicatorMode);
	public readonly labelPosition = input<HlmLabelPosition>('end');

	protected readonly _stringLabel = computed(() => {
		const label = this.label();
		return typeof label === 'string' ? label : null;
	});

	protected readonly _templateLabel = computed(() => {
		const label = this.label();
		return label instanceof HlmStepLabel ? label : null;
	});

	protected readonly _showOptionalLabel = computed(() => this.optional() && this.state() !== 'error');
	protected readonly _showErrorLabel = computed(() => this.state() === 'error' && !!this.errorMessage());

	protected readonly _buttonVariant = computed<ButtonVariants['variant']>(() => {
		if (this.state() === 'error') {
			return 'destructive';
		}

		if (this.selected() || this.reached()) {
			return 'default';
		}

		return 'outline';
	});

	protected readonly _indicatorClass = computed(
		() => `${buttonVariants({ size: 'icon-sm', variant: this._buttonVariant() })}`,
	);

	protected readonly _iconName = computed(() => {
		const state = this.state();
		const mode = this.indicatorMode();
		const showStateIcon = this.selected() || this.reached();

		if (mode === 'number') {
			return null;
		}

		if (state === 'error') {
			return 'lucideCircleAlert';
		}

		if (mode === 'state') {
			if (!showStateIcon) {
				return null;
			}

			return 'lucideCheck';

			// TODO: to be discussed: should we follow the same ui as material stepper and show a pencil icon for edit state?
			// if (state === 'done') return 'lucideCheck';
			// if (state === 'edit') return 'lucidePencil';
		}

		return this.icon();
	});
}
