import { BrnAvatar } from './lib/brn-avatar';
import { BrnAvatarFallback } from './lib/fallback';
import { BrnAvatarImage } from './lib/image';

export * from './lib/brn-avatar';
export * from './lib/fallback';
export * from './lib/image';
export * from './lib/util';

export const BrnAvatarImports = [BrnAvatar, BrnAvatarFallback, BrnAvatarImage] as const;
