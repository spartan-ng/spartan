import { NgModule } from '@angular/core';

import { HlmAvatarFallbackDirective } from './lib/fallback';
import { HlmAvatarComponent } from './lib/hlm-avatar.component';
import { HlmAvatarImageDirective } from './lib/image';

export * from './lib/fallback';
export * from './lib/hlm-avatar.component';
export * from './lib/image';

export const HlmAvatarImports = [HlmAvatarFallbackDirective, HlmAvatarImageDirective, HlmAvatarComponent] as const;

@NgModule({
	imports: [...HlmAvatarImports],
	exports: [...HlmAvatarImports],
})
export class HlmAvatarModule {}
