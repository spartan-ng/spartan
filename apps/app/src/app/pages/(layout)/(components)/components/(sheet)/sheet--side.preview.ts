import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCross } from '@ng-icons/lucide';
import { BrnSheetContent, BrnSheetTrigger } from '@spartan-ng/brain/sheet';
import { HlmButton } from '@spartan-ng/helm/button';

import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import {
	HlmSheet,
	HlmSheetContent,
	HlmSheetDescription,
	HlmSheetFooter,
	HlmSheetHeader,
	HlmSheetTitle,
} from '@spartan-ng/helm/sheet';

@Component({
	selector: 'spartan-sheet-side-preview',
	imports: [
		BrnSheetTrigger,
		BrnSheetContent,
		HlmSheet,
		HlmSheetContent,
		HlmSheetHeader,
		HlmSheetFooter,
		HlmSheetTitle,
		HlmSheetDescription,
		HlmButton,
		HlmInput,
		HlmLabel,
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
export class SheetSidePreview {}
