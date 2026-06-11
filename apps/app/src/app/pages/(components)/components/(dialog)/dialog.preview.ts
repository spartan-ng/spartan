import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-dialog-preview',
	imports: [HlmDialogImports, HlmFieldImports, HlmInputImports, HlmButtonImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-dialog>
			<button hlmDialogTrigger hlmBtn variant="outline">Open Dialog</button>
			<hlm-dialog-content *hlmDialogPortal="let ctx" class="sm:max-w-sm">
				<hlm-dialog-header>
					<h3 hlmDialogTitle>Edit profile</h3>
					<p hlmDialogDescription>Make changes to your profile here. Click save when you're done.</p>
				</hlm-dialog-header>
				<hlm-field-group>
					<hlm-field>
						<label hlmFieldLabel for="name">Name</label>
						<input hlmInput id="name" value="Pedro Duarte" />
					</hlm-field>
					<hlm-field>
						<label hlmLabel for="username">Username</label>
						<input hlmInput id="username" value="@peduarte" class="col-span-3" />
					</hlm-field>
				</hlm-field-group>
				<hlm-dialog-footer>
					<button hlmBtn variant="outline" hlmDialogClose>Cancel</button>
					<button hlmBtn type="submit">Save changes</button>
				</hlm-dialog-footer>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class DialogPreview {}

export const defaultImports = `
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
`;

export const defaultSkeleton = `
<hlm-dialog>
  <button hlmDialogTrigger hlmBtn variant="outline">Open Dialog</button>
  <hlm-dialog-content *hlmDialogPortal="let ctx">
    <hlm-dialog-header>
      <h3 hlmDialogTitle>Edit profile</h3>
      <p hlmDialogDescription>Make changes to your profile here. Click save when you're done.</p>
    </hlm-dialog-header>
    <hlm-dialog-footer>
      <button hlmBtn variant="outline" hlmDialogClose>Cancel</button>
      <button hlmBtn type="submit">Save changes</button>
    </hlm-dialog-footer>
  </hlm-dialog-content>
</hlm-dialog>
`;
