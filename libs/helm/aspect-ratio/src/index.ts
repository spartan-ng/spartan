import { NgModule } from '@angular/core';
import { HlmAspectRatio } from './lib/helm-aspect-ratio';

export * from './lib/helm-aspect-ratio';

@NgModule({
	imports: [HlmAspectRatio],
	exports: [HlmAspectRatio],
})
export class HlmAspectRatioModule {}
