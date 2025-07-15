import { NgModule } from '@angular/core';
import { HlmHoverCardContent } from './lib/hlm-hover-card-content';

export { HlmHoverCardContent } from './lib/hlm-hover-card-content';

export const HlmHoverCardImports = [HlmHoverCardContent] as const;

@NgModule({
	imports: [...HlmHoverCardImports],
	exports: [...HlmHoverCardImports],
})
export class HlmHoverCardModule {}
