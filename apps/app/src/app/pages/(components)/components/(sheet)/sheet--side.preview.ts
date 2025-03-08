import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/brain/sheet';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import {
	HlmSheetComponent,
	HlmSheetContentComponent,
	HlmSheetDescriptionDirective,
	HlmSheetFooterComponent,
	HlmSheetHeaderComponent,
	HlmSheetTitleDirective,
} from '@spartan-ng/ui-sheet-helm';

@Component({
	selector: 'spartan-sheet-side-preview',
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
		NgIcon,
		HlmIconDirective,
		HlmLabelDirective,
	],
	providers: [provideIcons({ lucideCross })],
	template: `
		<hlm-sheet>
			<div class="grid grid-cols-2 gap-2">
				<button id="left" variant="outline" brnSheetTrigger side="left" hlmBtn>left</button>
				<button id="right" variant="outline" brnSheetTrigger side="right" hlmBtn>right</button>
				<button id="top" variant="outline" brnSheetTrigger side="top" hlmBtn>top</button>
				<button id="bottom" variant="outline" brnSheetTrigger side="bottom" hlmBtn>bottom</button>
			</div>
			<hlm-sheet-content *brnSheetContent="let ctx">
				<hlm-sheet-header>
					<h3 hlmSheetTitle>Edit Profile</h3>
					<p hlmSheetDescription>Make changes to your profile here. Click save when you're done.</p>
				</hlm-sheet-header>
				<div class="grid gap-4 py-4">
					<div class="grid grid-cols-4 items-center gap-4">
						<label hlmLabel for="name" class="text-right">Name</label>
						<input hlmInput id="name" value="Pedro Duarte" class="col-span-3" />
					</div>
					<div class="grid grid-cols-4 items-center gap-4">
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
export class SheetSidePreviewComponent {}

export const sideCode = `
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { BrnSheetContentDirective, BrnSheetTriggerDirective } from '@spartan-ng/brain/sheet';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetTitleDirective,
} from '@spartan-ng/ui-sheet-helm';

@Component({
  selector: 'spartan-sheet-side-preview',
  standalone: true,
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
    <hlm-sheet>
      <div class="grid grid-cols-2 gap-2">
        <button id="left" variant="outline" brnSheetTrigger side="left" hlmBtn>left</button>
        <button id="right" variant="outline" brnSheetTrigger side="right" hlmBtn>right</button>
        <button id="top" variant="outline" brnSheetTrigger side="top" hlmBtn>top</button>
        <button id="bottom" variant="outline" brnSheetTrigger side="bottom" hlmBtn>bottom</button>
      </div>
      <hlm-sheet-content *brnSheetContent="let ctx">
        <hlm-sheet-header>
          <h3 hlmSheetTitle>Edit Profile</h3>
          <p hlmSheetDescription>Make changes to your profile here. Click save when you're done.</p>
        </hlm-sheet-header>
        <div class="py-4 grid gap-4">
          <div class="items-center grid grid-cols-4 gap-4">
            <label hlmLabel for="name" class="text-right">Name</label>
            <input hlmInput id="name" value="Pedro Duarte" class="col-span-3" />
          </div>
          <div class="items-center grid grid-cols-4 gap-4">
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
export class SheetSidePreviewComponent {}
`;
