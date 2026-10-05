import { Directive } from '@angular/core';
import { BrnAccordionContentLazy } from '@spartan-ng/brain/accordion';

@Directive({
	selector: 'ng-template[hlmAccordionContentLazy]',
	hostDirectives: [BrnAccordionContentLazy],
})
export class HlmAccordionContentLazy {}
