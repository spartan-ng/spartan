import { CdkMenuBar } from '@angular/cdk/menu';
import { Directive } from '@angular/core';

@Directive({
	selector: '[brnMenuBar]',
	hostDirectives: [CdkMenuBar],
})
export class BrnMenuBarDirective {}
