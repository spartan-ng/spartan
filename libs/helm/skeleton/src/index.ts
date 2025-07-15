import { NgModule } from '@angular/core';
import { HlmSkeleton } from './lib/hlm-skeleton';

export * from './lib/hlm-skeleton';

@NgModule({
	imports: [HlmSkeleton],
	exports: [HlmSkeleton],
})
export class HlmSkeletonModule {}
