import { Directive } from '@angular/core';
import { BrnHoverCardContent } from '@spartan-ng/brain/hover-card';

@Directive({
	selector: '[hlmHoverCardPortal],hlm-hover-card-portal',
	exportAs: 'hlmHoverCardPortal',
	hostDirectives: [BrnHoverCardContent],
})
export class HlmHoverCardPortal {}
