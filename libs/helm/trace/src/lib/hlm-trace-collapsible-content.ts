import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';
import { classes, hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-trace-collapsible-content',
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [{ directive: BrnCollapsibleContent, inputs: ['id'] }],
	host: { 'data-slot': 'trace-collapsible-content' },
	template: `
		<div [class]="_computedContentInnerClasses()" data-slot="trace-collapsible-content-inner">
			<ng-content />
		</div>
	`,
})
export class HlmTraceCollapsibleContent {
	public readonly contentInnerClasses = input<ClassValue>();

	protected readonly _computedContentInnerClasses = computed(() =>
		hlm(
			'spartan-trace-collapsible-content-inner text-muted-foreground min-w-0 wrap-break-word',
			this.contentInnerClasses(),
		),
	);

	constructor() {
		classes(
			() =>
				'spartan-trace-collapsible-content block min-w-0 overflow-hidden transition-[height] data-[state=closed]:h-0 data-[state=open]:h-(--brn-collapsible-content-height)',
		);
	}
}
