import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';
import { HlmSidebarService, type SidebarVariant } from './hlm-sidebar.service';
import { injectHlmSidebarConfig } from './hlm-sidebar.token';

@Component({
	selector: 'hlm-sidebar',
	imports: [NgTemplateOutlet, HlmSheetImports, BrnSheetImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[attr.data-slot]': '_dataSlot()',
		'[class]': '_computedClass()',
		'[attr.data-state]': '_dataState()',
		'[attr.data-collapsible]': '_dataCollapsible()',
		'[attr.data-variant]': '_dataVariant()',
		'[attr.data-side]': '_dataSide()',
	},
	template: `
		<ng-template #contentContainer>
			<ng-content />
		</ng-template>

		@if (collapsible() === 'none') {
			<ng-container *ngTemplateOutlet="contentContainer"></ng-container>
		} @else if (_sidebarService.isMobile()) {
			<hlm-sheet
				[side]="side()"
				[state]="_sidebarService.openMobile() ? 'open' : 'closed'"
				(stateChanged)="_sidebarService.setOpenMobile($event === 'open')"
			>
				<hlm-sheet-content
					*brnSheetContent="let ctx"
					data-slot="sidebar"
					data-sidebar="sidebar"
					data-mobile="true"
					class="bg-sidebar text-sidebar-foreground h-screen w-[var(--sidebar-width)] p-0 [&>button]:hidden"
					[style.--sidebar-width]="sidebarWidthMobile()"
				>
					<div class="flex h-full w-full flex-col">
						<ng-container *ngTemplateOutlet="contentContainer" />
					</div>
				</hlm-sheet-content>
			</hlm-sheet>
		} @else {
			<!-- Sidebar gap on desktop -->
			<div data-slot="sidebar-gap" [class]="_sidebarGapComputedClass()"></div>
			<div data-slot="sidebar-container" [class]="_sidebarContainerComputedClass()">
				<div
					data-sidebar="sidebar"
					data-slot="sidebar-inner"
					class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow"
				>
					<ng-container *ngTemplateOutlet="contentContainer" />
				</div>
			</div>
		}
	`,
})
export class HlmSidebar {
	protected readonly _sidebarService = inject(HlmSidebarService);
	private readonly _config = injectHlmSidebarConfig();

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	public readonly sidebarWidthMobile = input<string>(this._config.sidebarWidthMobile);

	public readonly side = input<'left' | 'right'>('left');
	public readonly variant = input<SidebarVariant>(this._sidebarService.variant());
	public readonly collapsible = input<'offcanvas' | 'icon' | 'none'>('offcanvas');

	protected readonly _sidebarGapComputedClass = computed(() =>
		hlm(
			'relative w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear',
			'group-data-[collapsible=offcanvas]:w-0',
			'group-data-[side=right]:rotate-180',
			this.variant() === 'floating' || this.variant() === 'inset'
				? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]'
				: 'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]',
		),
	);

	public readonly sidebarContainerClass = input<ClassValue>('');
	protected readonly _sidebarContainerComputedClass = computed(() =>
		hlm(
			'fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-200 ease-linear md:flex',
			this.side() === 'left'
				? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
				: 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
			this.variant() === 'floating' || this.variant() === 'inset'
				? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]'
				: 'group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] group-data-[side=left]:border-r group-data-[side=right]:border-l',
			this.sidebarContainerClass(),
		),
	);

	protected readonly _computedClass = computed(() => {
		if (this.collapsible() === 'none') {
			return hlm('bg-sidebar text-sidebar-foreground flex h-svh w-[var(--sidebar-width)] flex-col', this.userClass());
		} else if (this._sidebarService.isMobile()) {
			return hlm(this.userClass());
		} else {
			return hlm('text-sidebar-foreground group peer hidden md:block', this.userClass());
		}
	});

	protected readonly _dataSlot = computed(() => {
		return !this._sidebarService.isMobile() ? 'sidebar' : undefined;
	});

	private readonly _collapsibleAndNonMobile = computed(() => {
		return this.collapsible() !== 'none' && !this._sidebarService.isMobile();
	});

	protected readonly _dataState = computed(() => {
		return this._collapsibleAndNonMobile() ? this._sidebarService.state() : undefined;
	});

	protected readonly _dataCollapsible = computed(() => {
		if (this._collapsibleAndNonMobile()) {
			return this._sidebarService.state() === 'collapsed' ? this.collapsible() : '';
		}
		return undefined;
	});

	protected readonly _dataVariant = computed(() => {
		return this._collapsibleAndNonMobile() ? this.variant() : undefined;
	});

	protected readonly _dataSide = computed(() => {
		return this._collapsibleAndNonMobile() ? this.side() : undefined;
	});

	constructor() {
		// Sync variant input with service
		effect(() => {
			this._sidebarService.setVariant(this.variant());
		});
	}
}
