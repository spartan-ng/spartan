import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBrain, lucideChevronDown } from '@ng-icons/lucide';
import { BrnCollapsibleTrigger, injectBrnCollapsible } from '@spartan-ng/brain/collapsible';
import { HlmShimmerImports } from '@spartan-ng/helm/shimmer';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { injectHlmReasoning } from './hlm-reasoning-token';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'button[hlmReasoningTrigger]',
	imports: [NgIcon, HlmShimmerImports],
	providers: [provideIcons({ lucideBrain, lucideChevronDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: BrnCollapsibleTrigger, inputs: ['type'] }],
	host: {
		'data-slot': 'reasoning-trigger',
		'[class]': '_computedClass()',
	},
	template: `
		<ng-content>
			<ng-icon name="lucideBrain" size="1rem" />
			@if (_isStreaming() || _duration() === 0) {
				<span hlmShimmer>Thinking...</span>
			} @else if (_duration() === undefined) {
				<span>Thought for a few seconds</span>
			} @else {
				<span>Thought for {{ _duration() }} seconds</span>
			}
			<ng-icon
				name="lucideChevronDown"
				size="1rem"
				class="transition-transform"
				[class.rotate-180]="_collapsible?.expanded()"
			/>
		</ng-content>
	`,
})
export class HlmReasoningTrigger {
	protected readonly _collapsible = injectBrnCollapsible();
	private readonly _reasoning = injectHlmReasoning();

	protected readonly _isStreaming = computed(() => this._reasoning?.isStreaming() ?? false);
	protected readonly _duration = computed(() => this._reasoning?.duration());

	public readonly triggerClass = input<ClassValue>('');

	protected readonly _computedClass = computed(() =>
		hlm(
			'spartan-reasoning-trigger text-muted-foreground hover:text-foreground flex w-full cursor-pointer items-center gap-2 text-sm font-light transition-colors disabled:cursor-not-allowed disabled:opacity-50',
			this.triggerClass(),
		),
	);
}
