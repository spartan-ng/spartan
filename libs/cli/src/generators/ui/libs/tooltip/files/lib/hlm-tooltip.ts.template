import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnTooltip } from '@spartan-ng/brain/tooltip';

@Component({
	selector: 'hlm-tooltip',
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
