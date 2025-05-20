import { Directive } from '@angular/core';
import { injectTableClassesSettable } from '@spartan-ng/brain/core';

@Directive({ standalone: true, selector: '[hlmTable],brn-table[hlm]' })
export class HlmTableDirective {
	private readonly _tableClassesSettable = injectTableClassesSettable({ host: true, optional: true });

	constructor() {
		this._tableClassesSettable?.setTableClasses({
			table: 'flex flex-col text-sm [&_cdk-row:last-child]:border-0',
			headerRow:
				'flex min-w-[100%] w-fit border-b border-border [&.cdk-table-sticky]:bg-background ' +
				'[&.cdk-table-sticky>*]:z-[101] [&.cdk-table-sticky]:before:z-0 [&.cdk-table-sticky]:before:block [&.cdk-table-sticky]:hover:before:bg-muted/50 [&.cdk-table-sticky]:before:absolute [&.cdk-table-sticky]:before:inset-0',
			bodyRow:
				'flex min-w-[100%] w-fit border-b border-border transition-[background-color] hover:bg-muted/50 [&:has([role=checkbox][aria-checked=true])]:bg-muted',
		});
	}
}
