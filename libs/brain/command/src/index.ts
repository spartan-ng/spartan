import { NgModule } from '@angular/core';
import { BrnCommandEmptyDirective } from './lib/brn-command-empty.directive';
import { BrnCommandGroupDirective } from './lib/brn-command-group.directive';
import { BrnCommandItemDirective } from './lib/brn-command-item.directive';
import { BrnCommandListDirective } from './lib/brn-command-list.directive';
import { BrnCommandSearchInputDirective } from './lib/brn-command-search-input.directive';
import { BrnCommandDirective } from './lib/brn-command.directive';

export * from './lib/brn-command-empty.directive';
export * from './lib/brn-command-group.directive';
export * from './lib/brn-command-item.directive';
export * from './lib/brn-command-item.token';
export * from './lib/brn-command-list.directive';
export * from './lib/brn-command-search-input.directive';
export * from './lib/brn-command-search-input.token';
export * from './lib/brn-command.directive';
export * from './lib/brn-command.token';

export const BrnCommandImports = [
	BrnCommandEmptyDirective,
	BrnCommandGroupDirective,
	BrnCommandItemDirective,
	BrnCommandListDirective,
	BrnCommandSearchInputDirective,
	BrnCommandDirective,
] as const;

@NgModule({
	imports: [...BrnCommandImports],
	exports: [...BrnCommandImports],
})
export class BrnCommandModule {}
