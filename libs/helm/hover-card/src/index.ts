import { NgModule } from '@angular/core';
import { HlmHoverCardContentComponent } from './lib/hlm-hover-card-content.component';

export { HlmHoverCardContentComponent } from './lib/hlm-hover-card-content.component';

export const HlmHoverCardImports = [HlmHoverCardContentComponent] as const;

@NgModule({
	imports: [...HlmHoverCardImports],
	exports: [...HlmHoverCardImports],
})
export class HlmHoverCardModule {}
