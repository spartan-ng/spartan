import { NgModule } from '@angular/core';
import { HlmSkeletonComponent } from './lib/hlm-skeleton.component';

export * from './lib/hlm-skeleton.component';

@NgModule({
	imports: [HlmSkeletonComponent],
	exports: [HlmSkeletonComponent],
})
export class HlmSkeletonModule {}
