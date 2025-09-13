import { NgModule } from '@angular/core';

export const HlmNavigationMenuImports = [] as const;

@NgModule({
	imports: [...HlmNavigationMenuImports],
	exports: [...HlmNavigationMenuImports],
})
export class HlmNavigationMenuModule {}
