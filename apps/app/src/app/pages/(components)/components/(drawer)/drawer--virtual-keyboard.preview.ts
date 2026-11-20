import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnDrawerVirtualKeyboardProvider } from '@spartan-ng/brain/drawer';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-drawer-virtual-keyboard-preview',
	imports: [BrnDrawerVirtualKeyboardProvider, HlmDrawerImports, HlmButtonImports, HlmInputImports, HlmLabelImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-drawer brnDrawerVirtualKeyboardProvider showSwipeHandle>
			<button id="drawer-virtual-keyboard-trigger" hlmDrawerTrigger hlmBtn variant="outline">Edit Address</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Shipping address</h3>
					<p hlmDrawerDescription>On a phone, the focused field stays above the keyboard.</p>
				</hlm-drawer-header>
				<div class="grid gap-4 overflow-y-auto p-4">
					<div class="grid gap-2">
						<label hlmLabel for="virtual-keyboard-name">Full name</label>
						<input hlmInput id="virtual-keyboard-name" autocomplete="name" />
					</div>
					<div class="grid gap-2">
						<label hlmLabel for="virtual-keyboard-street">Street</label>
						<input hlmInput id="virtual-keyboard-street" autocomplete="address-line1" />
					</div>
					<div class="grid gap-2">
						<label hlmLabel for="virtual-keyboard-city">City</label>
						<input hlmInput id="virtual-keyboard-city" autocomplete="address-level2" />
					</div>
					<div class="grid gap-2">
						<label hlmLabel for="virtual-keyboard-zip">Postal code</label>
						<input hlmInput id="virtual-keyboard-zip" autocomplete="postal-code" inputmode="numeric" />
					</div>
				</div>
				<hlm-drawer-footer>
					<button hlmDrawerClose hlmBtn>Save</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
export class DrawerVirtualKeyboardPreview {}
