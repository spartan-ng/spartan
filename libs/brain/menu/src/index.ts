import { NgModule } from '@angular/core';

import { BrnContextMenuTrigger } from './lib/brn-context-menu-trigger';
import { BrnMenu } from './lib/brn-menu';
import { BrnMenuBar } from './lib/brn-menu-bar';
import { BrnMenuGroup } from './lib/brn-menu-group';
import { BrnMenuItem } from './lib/brn-menu-item';
import { BrnMenuItemCheckbox } from './lib/brn-menu-item-checkbox';
import { BrnMenuItemRadio } from './lib/brn-menu-item-radio';
import { BrnMenuTrigger } from './lib/brn-menu-trigger';

export * from './lib/brn-context-menu-trigger';
export * from './lib/brn-menu';
export * from './lib/brn-menu-bar';
export * from './lib/brn-menu-group';
export * from './lib/brn-menu-item';
export * from './lib/brn-menu-item-checkbox';
export * from './lib/brn-menu-item-radio';
export * from './lib/brn-menu-trigger';

export const BrnMenuItemImports = [BrnMenuGroup, BrnMenuItem, BrnMenuItemRadio, BrnMenuItemCheckbox] as const;
export const BrnMenuImports = [
	BrnMenuTrigger,
	BrnMenu,
	BrnMenuGroup,
	BrnMenuItem,
	BrnMenuItemRadio,
	BrnMenuItemCheckbox,
	BrnMenuBar,
	BrnContextMenuTrigger,
] as const;
export const BrnMenuBarImports = [...BrnMenuImports, BrnMenuBar] as const;
export const BrnContextMenuImports = [...BrnMenuImports, BrnContextMenuTrigger] as const;

@NgModule({
	imports: [...BrnMenuItemImports],
	exports: [...BrnMenuItemImports],
})
export class BrnMenuItemModule {}

@NgModule({
	imports: [...BrnMenuImports],
	exports: [...BrnMenuImports],
})
export class BrnMenuModule {}

@NgModule({
	imports: [...BrnMenuBarImports],
	exports: [...BrnMenuBarImports],
})
export class BrnMenuBarModule {}

@NgModule({
	imports: [...BrnContextMenuImports],
	exports: [...BrnContextMenuImports],
})
export class BrnContextMenuModule {}
