import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-drawer-preview',
	imports: [HlmDrawerImports, HlmButtonImports, HlmFieldImports, HlmInputImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-drawer>
			<button id="edit-profile" hlmDrawerTrigger hlmBtn variant="outline">Open Drawer</button>
			<hlm-drawer-content *hlmDrawerPortal="let ctx">
				<hlm-drawer-header>
					<h3 hlmDrawerTitle>Edit Profile</h3>
					<p hlmDrawerDescription>Make changes to your profile here. Click save when you're done.</p>
				</hlm-drawer-header>
				<hlm-field-group class="px-4">
					<hlm-field>
						<label hlmFieldLabel for="name">Name</label>
						<input hlmInput id="name" value="Pedro Duarte" />
					</hlm-field>
					<hlm-field>
						<label hlmFieldLabel for="username">Username</label>
						<input hlmInput id="username" value="peduarte" />
					</hlm-field>
				</hlm-field-group>
				<hlm-drawer-footer>
					<button hlmBtn type="submit">Save Changes</button>
					<button hlmDrawerClose hlmBtn variant="outline">Cancel</button>
				</hlm-drawer-footer>
			</hlm-drawer-content>
		</hlm-drawer>
	`,
})
export class DrawerPreview {}

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
  </hlm-drawer-content>
</hlm-drawer>
`;
