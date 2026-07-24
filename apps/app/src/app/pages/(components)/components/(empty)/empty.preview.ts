import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideFolderCode } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

@Component({
	selector: 'spartan-empty-preview',
	imports: [NgIcon, HlmButton, HlmEmptyImports],
	providers: [provideIcons({ lucideFolderCode, lucideArrowUpRight })],
	template: `
		<hlm-empty>
			<hlm-empty-header>
				<hlm-empty-media variant="icon">
					<ng-icon name="lucideFolderCode" />
				</hlm-empty-media>
				<div hlmEmptyTitle>No Projects Yet</div>
				<div hlmEmptyDescription>
					You haven&apos;t created any projects yet. Get started by creating your first project.
				</div>
			</hlm-empty-header>
			<hlm-empty-content class="flex-row justify-center gap-2">
				<button hlmBtn>Create Project</button>
				<button hlmBtn variant="outline">Import Project</button>
			</hlm-empty-content>
			<a href="#" hlmBtn class="text-muted-foreground" variant="link" size="sm">
				Learn More
				<ng-icon name="lucideArrowUpRight" />
			</a>
		</hlm-empty>
	`,
})
export class EmptyPreview {}

export const defaultImports = `
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
`;

export const defaultSkeleton = `
<hlm-empty>
  <hlm-empty-header>
    <hlm-empty-media variant="icon">
      <ng-icon name="lucideFolderCode" />
    </hlm-empty-media>
    <div hlmEmptyTitle>No data</div>
    <div hlmEmptyDescription>No data found</div>
  </hlm-empty-header>
  <hlm-empty-content>
    <button hlmBtn>Add data</button>
  </hlm-empty-content>
</hlm-empty>
`;
