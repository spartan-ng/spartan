import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCloud } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

@Component({
	selector: 'spartan-empty-outline',
	imports: [NgIcon, HlmButton, HlmEmptyImports],
	providers: [provideIcons({ lucideCloud })],
	template: `
		<div hlmEmpty class="border border-dashed">
			<div hlmEmptyHeader>
				<div hlmEmptyMedia variant="icon">
					<ng-icon name="lucideCloud" />
				</div>
				<div hlmEmptyTitle>Cloud Storage Empty</div>
				<div hlmEmptyDescription>Upload files to your cloud storage to access them anywhere.</div>
			</div>
			<div hlmEmptyContent>
				<button hlmBtn variant="outline">Upload Files</button>
			</div>
		</div>
	`,
})
export class EmptyOutline {}
