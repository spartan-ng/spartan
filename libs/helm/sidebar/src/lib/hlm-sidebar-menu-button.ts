import { computed, Directive, inject, input } from '@angular/core';
import { hlm } from '@spartan-ng/brain/core';
import { BrnTooltipTrigger, provideBrnTooltipDefaultOptions } from '@spartan-ng/brain/tooltip';
import { DEFAULT_TOOLTIP_CONTENT_CLASSES } from '@spartan-ng/helm/tooltip';
import { cva } from 'class-variance-authority';

import { HlmSidebarService } from './hlm-sidebar.service';

import type { ClassValue } from 'clsx';

const sidebarMenuButtonVariants = cva(
	'peer/menu-button flex w-full items-center justify-start gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate group-data-[collapsible=icon]:[&>span]:hidden [&>svg]:size-4 [&>svg]:shrink-0 hover:cursor-pointer disabled:hover:cursor-default',
	{
		variants: {
			variant: {
				default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
				outline:
					'bg-background shadow-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sidebar-accent',
			},
			size: {
				default: 'h-8 text-sm',
				sm: 'h-7 text-xs',
				lg: 'h-12 text-sm group-data-[collapsible=icon]:!p-0',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

@Directive({
	selector: 'button[hlmSidebarMenuButton]',

	providers: [
		provideBrnTooltipDefaultOptions({
			showDelay: 150,
			hideDelay: 0,
			exitAnimationDuration: 150,
			tooltipContentClasses: DEFAULT_TOOLTIP_CONTENT_CLASSES,
			position: 'left',
		}),
	],
	hostDirectives: [
		{
			directive: BrnTooltipTrigger,
			inputs: ['brnTooltipTrigger: tooltip', 'aria-describedby'],
		},
	],
	host: {
		'data-sidebar': 'menu-button',
		'[attr.data-size]': 'size()',
		'[attr.data-active]': 'isActive()',
		'[class]': '_computedClass()',
	},
})
export class HlmSidebarMenuButton {
	private readonly _sidebarService = inject(HlmSidebarService);

	public readonly variant = input<'default' | 'outline'>('default');
	public readonly size = input<'default' | 'sm' | 'lg'>('default');
	public readonly isActive = input<boolean>(false);
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _isTooltipHidden = computed(
		() => this._sidebarService.state() !== 'collapsed' || this._sidebarService.isMobile(),
	);
	protected readonly _computedClass = computed(() =>
		hlm(sidebarMenuButtonVariants({ variant: this.variant(), size: this.size() }), this.userClass()),
	);
}
