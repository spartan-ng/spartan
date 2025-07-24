import { NgModule } from '@angular/core';
import { BrnHoverCard } from './lib/brn-hover-card';
import { BrnHoverCardContent, BrnHoverCardTrigger } from './lib/brn-hover-card-content.service';

export * from './lib/brn-hover-card';
export * from './lib/brn-hover-card-content.service';
export * from './lib/createHoverObservable';

export const BrnHoverCardImports = [BrnHoverCard, BrnHoverCardContent, BrnHoverCardTrigger] as const;

@NgModule({
	imports: [...BrnHoverCardImports],
	exports: [...BrnHoverCardImports],
})
export class BrnHoverCardModule {}
