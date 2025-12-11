import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmTextarea } from '@spartan-ng/helm/textarea';

@Component({
	selector: 'spartan-preset-save',
	imports: [BrnDialogImports, HlmDialogImports, HlmInput, HlmTextarea, HlmButton, HlmLabel],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-dialog>
			<button id="save-presets" hlmDialogTrigger hlmBtn variant="secondary">Save</button>
			<hlm-dialog-content class="sm:max-w-[425px]" *brnDialogContent="let ctx">
				<hlm-dialog-header>
					<h3 hlmDialogTitle>Save preset</h3>
					<p hlmDialogDescription>
						This will save the current playground state as a preset which you can access later or share with others.
					</p>
				</hlm-dialog-header>
				<div class="grid gap-4">
					<div class="grid gap-3">
						<label hlmLabel for="name">Name</label>
						<input hlmInput id="name" />
					</div>
					<div class="grid gap-3">
						<label hlmLabel for="description">Description</label>
						<textarea hlmTextarea id="description" rows="3"></textarea>
					</div>
				</div>
				<hlm-dialog-footer>
					<button hlmBtn type="submit">Save changes</button>
				</hlm-dialog-footer>
			</hlm-dialog-content>
		</hlm-dialog>
	`,
})
export class PresetSave {}
