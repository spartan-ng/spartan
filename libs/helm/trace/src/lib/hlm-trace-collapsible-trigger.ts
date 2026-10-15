import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { BrnCollapsibleTrigger } from '@spartan-ng/brain/collapsible';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'button[hlmTraceCollapsibleTrigger]',
	imports: [NgIcon],
	providers: [provideIcons({ lucideChevronRight })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: BrnCollapsibleTrigger, inputs: ['type'] }],
	host: { 'data-slot': 'trace-collapsible-trigger' },
	template: `
		<ng-content />
		<ng-icon
			name="lucideChevronRight"
			class="transition-transform group-aria-expanded/trace-collapsible-trigger:rotate-90 motion-reduce:transition-none"
		/>
	`,
})
export class HlmTraceCollapsibleTrigger {
	constructor() {
		classes(
			() =>
				'spartan-trace-collapsible-trigger group/trace-collapsible-trigger text-muted-foreground hover:text-foreground has-[[data-status=error]]:text-destructive flex w-fit max-w-full min-w-0 cursor-pointer items-center text-left transition-colors outline-none',
		);
	}
}
