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
			<!-- A tall drawer with its own scroll area leaves room to scroll the field above the keyboard. -->
			<hlm-drawer-content *hlmDrawerPortal="let ctx" class="h-[calc(100dvh-6rem)]">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Shipping address</h3>
					<p hlmDrawerDescription>On a phone, the focused field stays above the keyboard.</p>
				</hlm-drawer-header>
				<div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
					<div class="grid gap-4">
						@for (field of _fields; track field.id) {
							<div class="grid gap-2">
								<label hlmLabel [for]="field.id">{{ field.label }}</label>
								<input
									hlmInput
									[id]="field.id"
									[type]="field.type"
									[attr.autocomplete]="field.autocomplete"
									[attr.inputmode]="field.inputmode"
								/>
							</div>
						}
					</div>
				</div>
				<hlm-drawer-footer>
					<button hlmDrawerClose hlmBtn>Save</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
export class DrawerVirtualKeyboardPreview {
	protected readonly _fields = [
		{ id: 'virtual-keyboard-name', label: 'Full name', type: 'text', autocomplete: 'name' },
		{ id: 'virtual-keyboard-email', label: 'Email', type: 'email', autocomplete: 'email' },
		{ id: 'virtual-keyboard-phone', label: 'Phone', type: 'tel', autocomplete: 'tel' },
		{ id: 'virtual-keyboard-street', label: 'Street', type: 'text', autocomplete: 'address-line1' },
		{ id: 'virtual-keyboard-apartment', label: 'Apartment', type: 'text', autocomplete: 'address-line2' },
		{ id: 'virtual-keyboard-city', label: 'City', type: 'text', autocomplete: 'address-level2' },
		{ id: 'virtual-keyboard-region', label: 'County', type: 'text', autocomplete: 'address-level1' },
		{
			id: 'virtual-keyboard-zip',
			label: 'Postal code',
			type: 'text',
			autocomplete: 'postal-code',
			inputmode: 'numeric',
		},
	];
}
