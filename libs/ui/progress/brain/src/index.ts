import { NgModule } from '@angular/core';

import { BrnProgressIndicatorComponent } from './lib/brn-progress-indicator.component';
import { BrnProgressComponent } from './lib/brn-progress.component';
export { injectBrnProgress } from './lib/brn-progress.token';

export * from './lib/brn-progress-indicator.component';
export * from './lib/brn-progress.component';

export const BrnProgressImports = [BrnProgressComponent, BrnProgressIndicatorComponent] as const;

@NgModule({
	imports: [...BrnProgressImports],
	exports: [...BrnProgressImports],
})
export class BrnProgressModule {}
