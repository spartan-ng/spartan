import { NgModule } from '@angular/core';

import { HlmCommandDialogCloseButtonDirective } from './lib/hlm-command-dialog-close-button.directive';
import { HlmCommandDialogDirective } from './lib/hlm-command-dialog.directive';
import { HlmCommandEmptyDirective } from './lib/hlm-command-empty.directive';
import { HlmCommandGroupLabelComponent } from './lib/hlm-command-group-label.component';
import { HlmCommandGroupComponent } from './lib/hlm-command-group.component';
import { HlmCommandIconDirective } from './lib/hlm-command-icon.directive';
import { HlmCommandItemComponent } from './lib/hlm-command-item.component';
import { HlmCommandListComponent } from './lib/hlm-command-list.component';
import { HlmCommandSearchInputComponent } from './lib/hlm-command-search-input.component';
import { HlmCommandSearchComponent } from './lib/hlm-command-search.component';
import { HlmCommandSeparatorComponent } from './lib/hlm-command-separator.component';
import { HlmCommandShortcutComponent } from './lib/hlm-command-shortcut.component';
import { HlmCommandComponent } from './lib/hlm-command.component';

export * from './lib/hlm-command-dialog-close-button.directive';
export * from './lib/hlm-command-dialog.directive';
export * from './lib/hlm-command-empty.directive';
export * from './lib/hlm-command-group-label.component';
export * from './lib/hlm-command-group.component';
export * from './lib/hlm-command-icon.directive';
export * from './lib/hlm-command-item.component';
export * from './lib/hlm-command-list.component';
export * from './lib/hlm-command-search-input.component';
export * from './lib/hlm-command-search.component';
export * from './lib/hlm-command-separator.component';
export * from './lib/hlm-command-shortcut.component';
export * from './lib/hlm-command.component';

export const HlmCommandImports = [
	HlmCommandComponent,
	HlmCommandItemComponent,
	HlmCommandSeparatorComponent,
	HlmCommandGroupComponent,
	HlmCommandListComponent,
	HlmCommandShortcutComponent,
	HlmCommandIconDirective,
	HlmCommandDialogCloseButtonDirective,
	HlmCommandDialogDirective,
	HlmCommandSearchInputComponent,
	HlmCommandSearchComponent,
	HlmCommandGroupLabelComponent,
	HlmCommandEmptyDirective,
] as const;

@NgModule({
	imports: [...HlmCommandImports],
	exports: [...HlmCommandImports],
})
export class HlmCommandModule {}
