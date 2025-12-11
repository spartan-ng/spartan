import { Component } from '@angular/core';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
	selector: 'spartan-dialog-preview',
	imports: [BrnDialogImports, HlmDialogImports, HlmLabelImports, HlmInputImports, HlmButtonImports],
	template: `
		<hlm-dialog>
			<button id="edit-profile" hlmDialogTrigger hlmBtn variant="outline">Open Dialog</button>
			<hlm-dialog-content class="sm:max-w-[425px]" *brnDialogContent="let ctx">
				<hlm-dialog-header>
					<h3 hlmDialogTitle>Edit profile</h3>
					<p hlmDialogDescription>Make changes to your profile here. Click save when you're done.</p>
				</hlm-dialog-header>
				<div class="grid gap-4">
					<div class="grid gap-3">
						<label hlmLabel for="name" class="text-right">Name</label>
						<input hlmInput id="name" value="Pedro Duarte" />
					</div>
					<div class="grid gap-3">
						<label hlmLabel for="username" class="text-right">Username</label>
						<input hlmInput id="username" value="@peduarte" class="col-span-3" />
					</div>
				</div>
				<hlm-dialog-footer>
					<button hlmBtn variant="outline" brnDialogClose>Cancel</button>
					<button hlmBtn type="submit">Save changes</button>
				</hlm-dialog-footer>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class DialogPreview {}

export const defaultImports = `
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
`;

export const defaultSkeleton = `
<hlm-dialog>
  <button hlmDialogTrigger hlmBtn variant="outline">Open Dialog</button>
  <hlm-dialog-content *brnDialogContent="let ctx">
    <hlm-dialog-header>
      <h3 brnDialogTitle hlm>Edit profile</h3>
      <p brnDialogDescription hlm>Make changes to your profile here. Click save when you're done.</p>
    </hlm-dialog-header>
    <hlm-dialog-footer>
      <button hlmBtn variant="outline" brnDialogClose>Cancel</button>
      <button hlmBtn type="submit">Save changes</button>
    </hlm-dialog-footer>
  </hlm-dialog-content>
</hlm-dialog>
`;
