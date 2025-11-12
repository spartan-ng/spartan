import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnTooltip } from '@spartan-ng/brain/tooltip';

@Component({
	selector: 'hlm-tooltip',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[style]': '{display: "contents"}',
	},
	hostDirectives: [BrnTooltip],
	template: `
		<ng-content />
	`,
})
export class HlmTooltip {}
