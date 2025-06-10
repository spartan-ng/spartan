import { CdkCellDef } from '@angular/cdk/table';
import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
	selector: '[brnCellDef]',
	exportAs: 'brnCellDef',
})
export class BrnCellDefDirective extends CdkCellDef {
	public override template: TemplateRef<unknown>;

	constructor() {
		const template = inject<TemplateRef<unknown>>(TemplateRef);

		super(template);
		this.template = template;
	}
}
