import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideLink2 } from '@ng-icons/lucide';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';

@Component({
	selector: 'spartan-input-group-custom-input-preview',
	imports: [HlmInputGroupImports, CdkTextareaAutosize],
	providers: [
		provideIcons({
			lucideLink2,
		}),
	],
	host: {
		class: 'grid w-full max-w-sm gap-6',
	},
	template: `
		<div hlmInputGroup>
			<textarea
				data-slot="input-group-control"
				placeholder="Autoresize textarea..."
				cdkTextareaAutosize
				class="flex min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
			></textarea>

			<div hlmInputGroupAddon align="block-end">
				<button hlmInputGroupButton class="ml-auto" size="sm" variant="default">Submit</button>
			</div>
		</div>
	`,
})
export class InputGroupCustomInputPreview {}
