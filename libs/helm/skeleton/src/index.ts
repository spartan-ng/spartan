import { NgModule } from '@angular/core';
import { HlmSkeleton } from './lib/hlm-skeleton';

export * from './lib/hlm-skeleton';

export const HlmSkeletonImports = [HlmSkeleton] as const;

@NgModule({
	imports: [...HlmSkeletonImports],
	exports: [...HlmSkeletonImports],
})
export class HlmSkeletonModule {}
