import { BrnMessageScrollerButton } from './lib/brn-message-scroller-button';
import { BrnMessageScrollerContent } from './lib/brn-message-scroller-content';
import { BrnMessageScrollerItem } from './lib/brn-message-scroller-item';
import { BrnMessageScrollerProvider } from './lib/brn-message-scroller-provider';
import { BrnMessageScrollerRoot } from './lib/brn-message-scroller-root';
import { BrnMessageScrollerViewport } from './lib/brn-message-scroller-viewport';

export * from './lib/brn-message-scroller';
export * from './lib/brn-message-scroller-button';
export * from './lib/brn-message-scroller-content';
export * from './lib/brn-message-scroller-item';
export * from './lib/brn-message-scroller-provider';
export * from './lib/brn-message-scroller-root';
export * from './lib/brn-message-scroller-viewport';
export * from './lib/brn-message-scroller.token';
export * from './lib/brn-message-scroller.types';

export const BrnMessageScrollerImports = [
	BrnMessageScrollerProvider,
	BrnMessageScrollerRoot,
	BrnMessageScrollerViewport,
	BrnMessageScrollerContent,
	BrnMessageScrollerItem,
	BrnMessageScrollerButton,
] as const;
