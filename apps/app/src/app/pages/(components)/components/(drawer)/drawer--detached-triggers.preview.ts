import { ChangeDetectionStrategy, Component, computed, viewChild } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawer, HlmDrawerImports } from '@spartan-ng/helm/drawer';

interface Plan {
	name: string;
	price: string;
	description: string;
}

@Component({
	selector: 'spartan-drawer-detached-triggers-preview',
	imports: [HlmDrawerImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex flex-wrap justify-center gap-2">
			@for (plan of _plans; track plan.name) {
				<button [hlmDrawerTriggerFor]="drawer" [payload]="plan" hlmBtn variant="outline">
					{{ plan.name }}
				</button>
			}
		</div>

		<hlm-drawer #drawer="hlmDrawer">
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>{{ _plan()?.name }} plan</h3>
					<p hlmDrawerDescription>{{ _plan()?.price }}</p>
				</hlm-drawer-header>
				<p class="text-muted-foreground px-4 text-sm">{{ _plan()?.description }}</p>
				<hlm-drawer-footer>
					<button hlmBtn>Choose {{ _plan()?.name }}</button>
					<button hlmDrawerClose hlmBtn variant="outline">Cancel</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
export class DrawerDetachedTriggersPreview {
	private readonly _drawer = viewChild.required(HlmDrawer);
	/** The plan of the trigger that opened the drawer. */
	protected readonly _plan = computed(() => this._drawer().payload() as Plan | undefined);

	protected readonly _plans: Plan[] = [
		{ name: 'Hobby', price: '$0 / month', description: 'For side projects and trying things out.' },
		{ name: 'Pro', price: '$20 / month', description: 'For professionals shipping to production.' },
		{ name: 'Team', price: '$50 / month', description: 'For teams that collaborate on many projects.' },
	];
}
