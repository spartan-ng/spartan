import { CdkStepHeader, StepState } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCircleAlert, lucidePencil } from '@ng-icons/lucide';
import { ButtonVariants, buttonVariants } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmStepLabel } from './hlm-step-label';
import { HlmLabelPosition } from './hlm-stepper';

export type HlmStepperIndicatorMode = 'number' | 'state' | 'icon';

@Component({
	selector: 'hlm-step-header',
	imports: [NgTemplateOutlet, HlmIconImports],
	providers: [provideIcons({ lucideCheck, lucideCircleAlert, lucidePencil })],
	template: `
		<span aria-hidden="true" hlmBtn [class]="indicatorClass()">
			@if (iconName(); as icon) {
				<ng-icon hlm [name]="icon" size="sm" />
			} @else {
				<span>{{ index() + 1 }}</span>
			}
		</span>

		<span
			class="flex min-w-0 touch-manipulation flex-col truncate text-sm font-medium"
			[class.text-destructive]="state() === 'error'"
		>
			@if (templateLabel(); as templateLabel) {
				<ng-container [ngTemplateOutlet]="templateLabel.template" />
			} @else if (stringLabel(); as stringLabel) {
				{{ stringLabel }}
			} @else {
				Step {{ index() + 1 }}
			}

			@if (showOptionalLabel()) {
				<span class="text-muted-foreground text-xs">Optional</span>
			}

			@if (showErrorLabel()) {
				<span class="text-destructive text-xs">{{ errorMessage() }}</span>
			}
		</span>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class:
			'group inline-flex shrink-0 outline-none items-center gap-2 touch-manipulation transition-opacity data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
		'[class.flex-col]': 'labelPosition() === "bottom"',
		'[class.text-center]': 'labelPosition() === "bottom"',
		'[attr.data-disabled]': 'disabled() ? "true" : null',
	},
})
export class HlmStepHeader extends CdkStepHeader {
	readonly state = input<StepState>('number');
	readonly label = input<HlmStepLabel | string | null>(null);
	readonly errorMessage = input('');
	readonly index = input(0, { transform: numberAttribute });
	readonly selected = input(false, { transform: booleanAttribute });
	readonly reached = input(false, { transform: booleanAttribute });
	readonly active = input(false, { transform: booleanAttribute });
	readonly optional = input(false, { transform: booleanAttribute });
	readonly disabled = input(false, { transform: booleanAttribute });
	readonly icon = input<string | null>(null);
	readonly indicatorMode = input<HlmStepperIndicatorMode>('state');
	readonly labelPosition = input<HlmLabelPosition>('end');

	protected readonly stringLabel = computed(() => {
		const label = this.label();
		return typeof label === 'string' ? label : null;
	});

	readonly templateLabel = computed(() => {
		const label = this.label();
		return label instanceof HlmStepLabel ? label : null;
	});

	readonly showOptionalLabel = computed(() => this.optional() && this.state() !== 'error');
	readonly showErrorLabel = computed(() => this.state() === 'error' && !!this.errorMessage());

	readonly buttonVariant = computed<ButtonVariants['variant']>(() => {
		if (this.state() === 'error') {
			return 'destructive';
		}

		if (this.selected() || this.reached()) {
			return 'default';
		}

		return 'outline';
	});

	readonly indicatorClass = computed(() => `${buttonVariants({ size: 'icon-sm', variant: this.buttonVariant() })}`);

	readonly iconName = computed(() => {
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
			return null;
		}

		return this.icon();
	});
}
