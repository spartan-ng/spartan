import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';

@Component({
	selector: 'spartan-sheet-size-preview',
	imports: [HlmSheetImports, HlmFieldImports, HlmButtonImports, HlmInputImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-sheet side="right">
			<button id="edit-profile" variant="outline" hlmSheetTrigger hlmBtn>Open</button>
			<hlm-sheet-content *hlmSheetPortal="let ctx" class="w-[400px] sm:w-[540px] sm:max-w-none">
				<hlm-sheet-header>
					<h3 hlmSheetTitle>Edit Profile</h3>
					<p hlmSheetDescription>Make changes to your profile here. Click save when you're done.</p>
				</hlm-sheet-header>
				<hlm-field-group class="px-4">
					<hlm-field>
						<label hlmFieldLabel for="name">Name</label>
						<input hlmInput id="name" value="Pedro Duarte" />
					</hlm-field>
					<hlm-field>
						<label hlmFieldLabel for="username">Username</label>
						<input hlmInput id="username" value="@peduarte" />
					</hlm-field>
				</hlm-field-group>
				<hlm-sheet-footer>
					<button hlmBtn type="submit">Save Changes</button>
				</hlm-sheet-footer>
			</hlm-sheet-content>
		</hlm-sheet>
	`,
})
export class SheetSizePreview {}
