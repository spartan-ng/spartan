import { NgModule } from '@angular/core';
import { HlmAspectRatioDirective } from './lib/helm-aspect-ratio.directive';

export * from './lib/helm-aspect-ratio.directive';

@NgModule({
	imports: [HlmAspectRatioDirective],
	exports: [HlmAspectRatioDirective],
})
export class HlmAspectRatioModule {}
