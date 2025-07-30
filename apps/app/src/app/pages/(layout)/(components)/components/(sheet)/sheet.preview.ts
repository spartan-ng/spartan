import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/brain/sheet';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import {
	HlmSheetComponent,
	HlmSheetContentComponent,
	HlmSheetDescriptionDirective,
	HlmSheetFooterComponent,
	HlmSheetHeaderComponent,
	HlmSheetTitleDirective,
} from '@spartan-ng/helm/sheet';

@Component({
	selector: 'spartan-sheet-preview',
	imports: [
		BrnSheetTriggerDirective,
		BrnSheetContentDirective,
		HlmSheetComponent,
		HlmSheetContentComponent,
		HlmSheetHeaderComponent,
		HlmSheetFooterComponent,
		HlmSheetTitleDirective,
		HlmSheetDescriptionDirective,
		HlmButtonDirective,
		HlmInputDirective,
		HlmLabelDirective,
	],
	providers: [provideIcons({ lucideCross })],
	template: `
		<hlm-sheet side="right">
			<button id="edit-profile" variant="outline" brnSheetTrigger hlmBtn>Edit Profile</button>
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
				</hlm-sheet-footer>
			</hlm-sheet-content>
		</hlm-sheet>
	`,
})
export class SheetPreviewComponent {}

export const defaultCode = `
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/brain/sheet';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetTitleDirective,
} from '@spartan-ng/helm/sheet';

@Component({
  selector: 'spartan-sheet-preview',
imports: [
    BrnSheetTriggerDirective,
    BrnSheetContentDirective,
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetHeaderComponent,
    HlmSheetFooterComponent,
    HlmSheetTitleDirective,
    HlmSheetDescriptionDirective,
    HlmButtonDirective,
    HlmInputDirective,
    HlmIconDirective,
    HlmLabelDirective,
  ],
  providers: [provideIcons({ lucideCross })],
  template: \`
    <hlm-sheet side="right">
      <button id="edit-profile" variant="outline" brnSheetTrigger hlmBtn>Edit Profile</button>
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
        </hlm-sheet-footer>
      </hlm-sheet-content>
    </hlm-sheet>
  \`,
})
export class SheetPreviewComponent {}`;
export const defaultImports = `
import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/brain/sheet';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetTitleDirective,
} from '@spartan-ng/helm/sheet';
`;
export const defaultSkeleton = `
<hlm-sheet>
    <button brnSheetTrigger>Edit Profile</button>
    <hlm-sheet-content *brnSheetContent='let ctx'>
        <hlm-sheet-header>
            <h3 hlmSheetTitle>Edit Profile</h3>
            <p hlmSheetDescription>Make changes to your profile here. Click save when you're done.</p>
        </hlm-sheet-header>
    </hlm-sheet-content>
</hlm-sheet>
`;
