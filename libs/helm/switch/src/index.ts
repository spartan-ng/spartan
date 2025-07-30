import { NgModule } from '@angular/core';

import { HlmSwitch } from './lib/hlm-switch';
import { HlmSwitchThumb } from './lib/hlm-switch-thumb';

export * from './lib/hlm-switch';
export * from './lib/hlm-switch-thumb';

export const HlmSwitchImports = [HlmSwitch, HlmSwitchThumb] as const;
@NgModule({
	imports: [...HlmSwitchImports],
	exports: [...HlmSwitchImports],
})
export class HlmSwitchModule {}
