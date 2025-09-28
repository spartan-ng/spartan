import { HlmAvatarFallback } from './lib/fallback';
import { HlmAvatar } from './lib/hlm-avatar';
import { HlmAvatarImage } from './lib/image';

export * from './lib/fallback';
export * from './lib/hlm-avatar';
export * from './lib/image';

export const HlmAvatarImports = [HlmAvatarFallback, HlmAvatarImage, HlmAvatar] as const;
