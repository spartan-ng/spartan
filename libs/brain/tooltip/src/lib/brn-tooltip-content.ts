import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { BrnTooltipPosition } from './brn-tooltip-position';
import { BrnTooltipStringTemplateOutlet } from './brn-tooltip-string-template-outlet';
import { BrnTooltipType } from './brn-tooltip-type';

let uniqueId = 0;

@Component({
	imports: [BrnTooltipStringTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class]': '_tooltipClass()',
		'[attr.id]': 'id()',
		'[attr.data-side]': '_position()',
		'[attr.data-state]': 'state()',
		role: 'tooltip',
	},
	template: `
		<ng-container *brnTooltipStringTemplateOutlet="_tooltipText()">{{ _tooltipText() }}</ng-container>

		<span [class]="_arrowClass()">
			<svg [class]="_svgClass()" width="10" height="5" viewBox="0 0 30 10" preserveAspectRatio="none">
				<polygon points="0,0 30,0 15,10" />
			</svg>
		</span>
	`,
})
export class BrnTooltipContent {
	public readonly id = input<string>(`brn-tooltip-${++uniqueId}`);
	public readonly state = signal<'closed' | 'opened'>('closed');

	protected readonly _tooltipClass = signal('');
	protected readonly _arrowClass = signal('');
	protected readonly _svgClass = signal('');

	protected readonly _position = signal<BrnTooltipPosition>('top');
	protected readonly _tooltipText = signal<BrnTooltipType>(null);

	public setProps(
		tooltipText: BrnTooltipType,
		position: BrnTooltipPosition,
		tooltipClasses: string,
		arrowClasses: string,
		svgClasses: string,
	): void {
		if (tooltipText) {
			this._tooltipText.set(tooltipText);
		}
		this._position.set(position);

		this._tooltipClass.set(tooltipClasses);
		this._arrowClass.set(arrowClasses);
		this._svgClass.set(svgClasses);
	}
}
