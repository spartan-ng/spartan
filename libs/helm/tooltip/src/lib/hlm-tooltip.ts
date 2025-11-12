import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BrnTooltip } from '@spartan-ng/brain/tooltip';

@Component({
	selector: 'hlm-tooltip',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [BrnTooltip],
	host: {
		'[style]': '{display: "contents"}',
	},
	template: `
		<ng-content />
	`,
})
export class HlmTooltip {}
