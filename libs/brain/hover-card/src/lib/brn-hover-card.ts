import { type AfterContentInit, contentChild, Directive } from '@angular/core';
import { BrnHoverCardContent, BrnHoverCardContentService, BrnHoverCardTrigger } from './brn-hover-card-content.service';

@Directive({
	selector: '[brnHoverCard],brn-hover-card',
	providers: [BrnHoverCardContentService],
})
export class BrnHoverCard implements AfterContentInit {
	private readonly _trigger = contentChild(BrnHoverCardTrigger);
	private readonly _content = contentChild(BrnHoverCardContent);

	public ngAfterContentInit() {
		if (!this._trigger() || !this._content()) return;
		this._trigger()?.mutableBrnHoverCardTriggerFor().set(this._content());
	}
}
