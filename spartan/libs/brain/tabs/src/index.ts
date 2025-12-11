import { BrnTabs } from './lib/brn-tabs';
import { BrnTabsContent } from './lib/brn-tabs-content';
import { BrnTabsList } from './lib/brn-tabs-list';
import { BrnTabsTrigger } from './lib/brn-tabs-trigger';

export * from './lib/brn-tabs';
export * from './lib/brn-tabs-content';
export * from './lib/brn-tabs-list';
export * from './lib/brn-tabs-paginated-list';
export * from './lib/brn-tabs-trigger';

export const BrnTabsImports = [BrnTabs, BrnTabsList, BrnTabsTrigger, BrnTabsContent] as const;
