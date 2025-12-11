import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import { BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';

@Component({
	selector: 'spartan-sheet-preview',
	imports: [BrnSheetImports, HlmSheetImports, HlmButtonImports, HlmInputImports, HlmLabelImports],
	providers: [provideIcons({ lucideCross })],
	template: `
		<hlm-sheet side="right">
			<button id="edit-profile" hlmSheetTrigger hlmBtn variant="outline">Open</button>
			<hlm-sheet-content *brnSheetContent="let ctx">
				<hlm-sheet-header>
					<h3 hlmSheetTitle>Edit Profile</h3>
					<p hlmSheetDescription>Make changes to your profile here. Click save when you're done.</p>
				</hlm-sheet-header>
				<div class="grid flex-1 auto-rows-min gap-6 px-4">
					<div class="grid gap-3">
						<label hlmLabel for="name" class="text-right">Name</label>
						<input hlmInput id="name" value="Pedro Duarte" class="col-span-3" />
					</div>
					<div class="grid gap-3">
						<label hlmLabel for="username" class="text-right">Username</label>
						<input hlmInput id="username" value="@peduarte" class="col-span-3" />
					</div>
				</div>
				<hlm-sheet-footer>
					<button hlmBtn type="submit">Save Changes</button>
					<button brnSheetClose hlmBtn variant="outline">Close</button>
				</hlm-sheet-footer>
			</hlm-sheet-content>
		</hlm-sheet>
	`,
})
export class SheetPreview {}

export const defaultImports = `
import { BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
`;
export const defaultSkeleton = `
<hlm-sheet>
  <button hlmSheetTrigger hlmBtn variant="outline">Open</button>
  <hlm-sheet-content *brnSheetContent="let ctx">
    <hlm-sheet-header>
      <h3 hlmSheetTitle>Are you absolutely sure?</h3>
      <p hlmSheetDescription>
        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
      </p>
    </hlm-sheet-header>
  </hlm-sheet-content>
</hlm-sheet>
`;
