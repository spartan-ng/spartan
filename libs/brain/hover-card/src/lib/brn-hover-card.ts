import { type AfterContentInit, ChangeDetectionStrategy, Component, contentChild } from '@angular/core';
import { BrnHoverCardContent, BrnHoverCardContentService, BrnHoverCardTrigger } from './brn-hover-card-content.service';

@Component({
	selector: 'brn-hover-card',
	providers: [BrnHoverCardContentService],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-content />
	`,
})
export class BrnHoverCard implements AfterContentInit {
	private readonly _trigger = contentChild(BrnHoverCardTrigger);
	private readonly _content = contentChild(BrnHoverCardContent);

	public ngAfterContentInit() {
		if (!this._trigger() || !this._content()) return;
		this._trigger()?.mutableBrnHoverCardTriggerFor().set(this._content());
	}
}
