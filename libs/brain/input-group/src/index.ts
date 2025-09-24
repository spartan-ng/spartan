import { NgModule } from '@angular/core';

import { BrnInputGroup } from './lib/brn-input-group';
import { BrnPrefix } from './lib/brn-prefix';
import { BrnPrefixAddon } from './lib/brn-prefix-addon';
import { BrnSuffix } from './lib/brn-suffix';
import { BrnSuffixAddon } from './lib/brn-suffix-addon';

export * from './lib/brn-input-group';
export * from './lib/brn-prefix';
export * from './lib/brn-prefix-addon';
export * from './lib/brn-suffix';
export * from './lib/brn-suffix-addon';

export const BrnInputGroupImports = [BrnSuffix, BrnPrefix, BrnSuffixAddon, BrnPrefixAddon, BrnInputGroup] as const;

@NgModule({
	imports: [...BrnInputGroupImports],
	exports: [...BrnInputGroupImports],
})
export class BrnInputGroupModule {}
