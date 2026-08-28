import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowDown } from '@ng-icons/lucide';
import { BrnMessageScrollerButton } from '@spartan-ng/brain/message-scroller';
import { HlmButton, provideBrnButtonConfig } from '@spartan-ng/helm/button';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector -- attribute selector on native button
	selector: 'button[hlmMessageScrollerButton]',
	imports: [NgIcon],
	providers: [provideIcons({ lucideArrowDown }), provideBrnButtonConfig({ variant: 'secondary', size: 'icon-sm' })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{ directive: HlmButton, inputs: ['variant', 'size'] },
		{
			directive: BrnMessageScrollerButton,
			inputs: ['direction', 'behavior', 'aria-label'],
		},
	],
	host: {
		'data-slot': 'message-scroller-button',
	},
	template: `
		<ng-icon name="lucideArrowDown" />
		<span class="sr-only">{{ _brn.resolvedAriaLabel() }}</span>
	`,
})
export class HlmMessageScrollerButton {
	private readonly _button = inject(HlmButton);
	protected readonly _brn = inject(BrnMessageScrollerButton);

	constructor() {
		this._button.setClass(
			'spartan-message-scroller-button pointer-events-none absolute -translate-x-1/2 rtl:translate-x-1/2 data-[active=true]:pointer-events-auto',
		);
	}
}
