import { Directive } from '@angular/core';
import { BrnCommandEmpty } from '@spartan-ng/brain/command';

@Directive({
	selector: '[hlmCommandEmptyState]',
	exportAs: 'hlmCommandEmptyState',
	hostDirectives: [BrnCommandEmpty],
})
export class HlmCommandEmptyState {}
