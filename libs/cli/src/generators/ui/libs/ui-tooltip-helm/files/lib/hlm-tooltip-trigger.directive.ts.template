import { Directive } from '@angular/core';
import { BrnTooltipTriggerDirective, provideBrnTooltipDefaultOptions } from '@spartan-ng/brain/tooltip';

const DEFAULT_TOOLTIP_CONTENT_CLASSES =
	'overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md fade-in-0 zoom-in-95 ' +
	'data-[state=open]:animate-in ' +
	'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ' +
	'data-[side=below]:slide-in-from-top-2 data-[side=above]:slide-in-from-bottom-2 ' +
	'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 ';

@Directive({
	selector: '[hlmTooltipTrigger]',
	providers: [
		provideBrnTooltipDefaultOptions({
			showDelay: 150,
			hideDelay: 300,
			exitAnimationDuration: 150,
			tooltipContentClasses: DEFAULT_TOOLTIP_CONTENT_CLASSES,
		}),
	],
	hostDirectives: [
		{
			directive: BrnTooltipTriggerDirective,
			inputs: [
				'brnTooltipDisabled: hlmTooltipDisabled',
				'brnTooltipTrigger: hlmTooltipTrigger',
				'aria-describedby',
				'position',
				'positionAtOrigin',
				'hideDelay',
				'showDelay',
				'exitAnimationDuration',
				'touchGestures',
			],
		},
	],
})
export class HlmTooltipTriggerDirective {}
