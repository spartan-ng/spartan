import { BreakpointObserver } from '@angular/cdk/layout';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { map } from 'rxjs/operators';

@Component({
	selector: 'spartan-drawer-responsive-preview',
	imports: [NgTemplateOutlet, HlmDialogImports, HlmDrawerImports, HlmButtonImports, HlmInputImports, HlmLabelImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-template #profileForm let-formClass="formClass">
			<form class="grid items-start gap-6" [class]="formClass" (submit)="$event.preventDefault()">
				<div class="grid gap-3">
					<label hlmLabel for="responsive-email">Email</label>
					<input hlmInput type="email" id="responsive-email" value="shadcn@example.com" />
				</div>
				<div class="grid gap-3">
					<label hlmLabel for="responsive-username">Username</label>
					<input hlmInput id="responsive-username" value="@shadcn" />
				</div>
				<button hlmBtn type="submit">Save changes</button>
			</form>
		</ng-template>

		@if (_isDesktop()) {
			<hlm-dialog>
				<button id="drawer-responsive-trigger" hlmDialogTrigger hlmBtn variant="outline">Edit Profile</button>
				<hlm-dialog-content *hlmDialogPortal="let ctx" class="sm:max-w-[425px]">
					<hlm-dialog-header>
						<h3 hlmDialogTitle>Edit profile</h3>
						<p hlmDialogDescription>Make changes to your profile here. Click save when you're done.</p>
					</hlm-dialog-header>
					<ng-container [ngTemplateOutlet]="profileForm" />
				</hlm-dialog-content>
			</hlm-dialog>
		} @else {
			<hlm-drawer>
				<button id="drawer-responsive-trigger" hlmDrawerTrigger hlmBtn variant="outline">Edit Profile</button>
				<hlm-drawer-content *hlmDrawerPortal="let ctx">
					<hlm-drawer-header class="text-start">
						<h3 hlmDrawerTitle>Edit profile</h3>
						<p hlmDrawerDescription>Make changes to your profile here. Click save when you're done.</p>
					</hlm-drawer-header>
					<ng-container [ngTemplateOutlet]="profileForm" [ngTemplateOutletContext]="{ formClass: 'p-4' }" />
				</hlm-drawer-content>
			</hlm-drawer>
		}
	`,
})
export class DrawerResponsivePreview {
	protected readonly _isDesktop = toSignal(
		inject(BreakpointObserver)
			.observe('(min-width: 768px)')
			.pipe(map((state) => state.matches)),
		{ initialValue: true },
	);
}
