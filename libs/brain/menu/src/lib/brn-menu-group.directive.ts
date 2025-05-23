import { CdkMenuGroup } from '@angular/cdk/menu';
import { Directive } from '@angular/core';

@Directive({
	selector: '[brnMenuGroup]',
	hostDirectives: [CdkMenuGroup],
})
export class BrnMenuGroupDirective {}
