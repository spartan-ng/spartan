import { NgModule } from '@angular/core';

import { HlmAlert } from './lib/hlm-alert';
import { HlmAlertDescription } from './lib/hlm-alert-description';
import { HlmAlertIcon } from './lib/hlm-alert-icon';
import { HlmAlertTitle } from './lib/hlm-alert-title';

export * from './lib/hlm-alert';
export * from './lib/hlm-alert-description';
export * from './lib/hlm-alert-icon';
export * from './lib/hlm-alert-title';

export const HlmAlertImports = [HlmAlert, HlmAlertTitle, HlmAlertDescription, HlmAlertIcon] as const;

@NgModule({
	imports: [...HlmAlertImports],
	exports: [...HlmAlertImports],
})
export class HlmAlertModule {}
