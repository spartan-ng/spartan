import { computed, Directive, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { injectHlmSidebarConfig } from './hlm-sidebar.token';

@Directive({
	selector: '[hlmSidebarWrapper],hlm-sidebar-wrapper',
	host: {
		'data-slot': 'sidebar-wrapper',
		'[class]': '_computedClass()',
		'[style.--sidebar-width]': 'sidebarWidth()',
		'[style.--sidebar-width-icon]': 'sidebarWidthIcon()',
	},
})
export class HlmSidebarWrapper {
	private readonly _config = injectHlmSidebarConfig();

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('group/sidebar-wrapper has-[[data-variant=inset]]:bg-sidebar flex min-h-svh w-full', this.userClass()),
	);

	public readonly sidebarWidth = input<string>(this._config.sidebarWidth);
	public readonly sidebarWidthIcon = input<string>(this._config.sidebarWidthIcon);
}
