import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
	BrnDrawer,
	BrnDrawerContent,
	BrnDrawerFooter,
	BrnDrawerHandle,
	BrnDrawerOverlay,
	BrnDrawerScroller,
} from '@spartan-ng/brain/drawer';

/**
 * Themed wrapper around `BrnDrawer`. Keeps helm scoped to presentation only:
 *
 * - All state, gesture, snap, scroll-lock, keyboard-avoidance, and modal-effect
 *   logic lives in `BrnDrawer` and its sub-directives.
 * - This component owns the template structure and applies Spartan's semantic
 *   Tailwind tokens (`bg-background`, `text-foreground`, `bg-muted-foreground`,
 *   `border-border`) plus layout classes. Light/dark flip is automatic.
 *
 * Inputs / outputs are surfaced via `hostDirectives` so bindings on
 * `<hlm-drawer>` are forwarded directly to `BrnDrawer`.
 */
@Component({
	selector: 'hlm-drawer',
	exportAs: 'hlmDrawer',
	imports: [BrnDrawerContent, BrnDrawerOverlay, BrnDrawerHandle, BrnDrawerScroller, BrnDrawerFooter],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [
		{
			directive: BrnDrawer,
			inputs: [
				'isOpen',
				'detent',
				'snapPoints',
				'initialSnap',
				'disableDrag',
				'disableDismiss',
				'disableScrollLocking',
				'avoidKeyboard',
				'tweenConfig',
				'prefersReducedMotion',
				'modalEffectRootId',
				'modalEffectThreshold',
			],
			outputs: ['dismissed', 'snapped', 'openStart', 'openEnd', 'closeStart', 'closeEnd'],
		},
	],
	host: {
		class: 'pointer-events-none fixed inset-0 overflow-hidden',
		'data-slot': 'drawer',
	},
	template: `
		@if (_drawer.state() !== 'closed') {
			<button
				brnDrawerOverlay
				class="fixed inset-0 z-[1] m-0 cursor-default touch-none border-none bg-black/80 p-0 select-none"
				style="-webkit-tap-highlight-color: transparent;"
				aria-label="Close"
			></button>

			<div
				brnDrawerContent
				class="bg-background text-foreground border-border pointer-events-auto absolute bottom-0 left-0 z-[2] flex w-full flex-col rounded-t-lg border-t shadow-lg backdrop-blur-xl [will-change:transform]"
				data-slot="drawer-content"
			>
				<div
					brnDrawerHandle
					class="mb-6 w-full cursor-grab touch-none active:cursor-grabbing"
					data-slot="drawer-handle"
				>
					<div class="flex h-10 w-full items-center justify-center">
						<div class="flex">
							<span
								class="bg-muted-foreground inline-block h-1 w-[18px] rounded-full"
								[style.transform]="_drawer.indicator1Transform()"
							></span>
							<span
								class="bg-muted-foreground inline-block h-1 w-[18px] rounded-full"
								[style.transform]="_drawer.indicator2Transform()"
							></span>
						</div>
					</div>
					<ng-content select="[hlmDrawerHeader]" />
				</div>

				<div class="relative flex min-h-0 flex-grow flex-col">
					<div brnDrawerScroller class="h-full overflow-y-auto overscroll-y-none" data-slot="drawer-body">
						<ng-content />
					</div>
				</div>

				<div brnDrawerFooter class="bg-background border-border absolute right-0 left-0 border-t">
					<ng-content select="[hlmDrawerFooter]" />
				</div>
			</div>
		}
	`,
})
export class HlmDrawer {
	// Public so `[hlmDrawerTriggerFor]="myDrawer.drawer"` can reach the
	// BrnDrawer host-directive instance from a template ref. The `_drawer`
	// alias is kept around so the template's existing `_drawer.state()` /
	// `_drawer.indicator1Transform()` bindings continue to compile against
	// the same field.
	public readonly drawer = inject(BrnDrawer, { host: true });
	protected readonly _drawer = this.drawer;
}
