import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { map } from 'rxjs/operators';

@Component({
	selector: 'spartan-drawer-preview',
	imports: [FormsModule, HlmDrawerImports, HlmButtonImports, HlmFieldImports, HlmRadioGroupImports, HlmBadgeImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-drawer #drawer="hlmDrawer" [showSwipeHandle]="_isMobile()" [swipeDirection]="_isMobile() ? 'down' : 'right'">
			<button id="drawer-demo-trigger" hlmDrawerTrigger hlmBtn variant="secondary">Open Drawer</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Pick a delivery time</h3>
					<p hlmDrawerDescription>We'll prepare your order as soon as possible.</p>
				</hlm-drawer-header>
				<div class="flex-1 overflow-y-auto p-4">
					<hlm-radio-group class="gap-2" aria-label="Delivery time" [(ngModel)]="deliveryTime">
						@for (time of _deliveryTimes; track time.value) {
							<label hlmFieldLabel [for]="time.id">
								<div hlmField orientation="horizontal">
									<div hlmFieldContent>
										<div hlmFieldTitle class="flex items-center gap-2">
											{{ time.label }}
											@if (time.badge) {
												<span hlmBadge variant="secondary">{{ time.badge }}</span>
											}
										</div>
										<div hlmFieldDescription>{{ time.description }}</div>
									</div>
									<hlm-radio [value]="time.value" [inputId]="time.id">
										<hlm-radio-indicator indicator />
									</hlm-radio>
								</div>
							</label>
						}
					</hlm-radio-group>
				</div>
				<hlm-drawer-footer>
					<button hlmBtn class="h-[34px]" (click)="confirm(drawer)">Confirm Delivery Time</button>
					<button hlmDrawerClose hlmBtn variant="outline">Cancel</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
export class DrawerPreview {
	protected readonly _isMobile = toSignal(
		inject(BreakpointObserver)
			.observe('(max-width: 767px)')
			.pipe(map((state) => state.matches)),
		{ initialValue: false },
	);

	public readonly deliveryTime = signal('asap');

	protected readonly _deliveryTimes = [
		{
			value: 'asap',
			id: 'delivery-asap',
			label: 'Standard delivery',
			description: '25–35 min · Driver assigned now',
			badge: 'Fastest',
		},
		{ value: '5-00', id: 'delivery-5-00', label: '5:00 PM – 5:15 PM', description: 'Prep starts at 4:45 PM' },
		{ value: '5-30', id: 'delivery-5-30', label: '5:30 PM – 5:45 PM', description: "Good if you're heading home" },
		{ value: '6-00', id: 'delivery-6-00', label: '6:00 PM – 6:15 PM', description: 'Most popular · High demand' },
		{ value: '6-30', id: 'delivery-6-30', label: '6:30 PM – 6:45 PM', description: 'Last slot before kitchen closes' },
	];

	public confirm(drawer: { close(): void }): void {
		const selected = this._deliveryTimes.find((time) => time.value === this.deliveryTime());
		if (!selected) return;

		drawer.close();
		toast('Delivery time confirmed', { description: selected.label });
	}
}

export const defaultImports = `
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
`;

export const defaultSkeleton = `
<hlm-drawer>
  <button hlmDrawerTrigger hlmBtn variant="outline">Open</button>
  <hlm-drawer-content *hlmDrawerPortal="let ctx">
    <hlm-drawer-header>
      <h3 hlmDrawerTitle>Are you absolutely sure?</h3>
      <p hlmDrawerDescription>This action cannot be undone.</p>
    </hlm-drawer-header>
    <hlm-drawer-footer>
      <button hlmBtn>Submit</button>
      <button hlmDrawerClose hlmBtn variant="outline">Cancel</button>
    </hlm-drawer-footer>
  </hlm-drawer-content>
</hlm-drawer>
`;
