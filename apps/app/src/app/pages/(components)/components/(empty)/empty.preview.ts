import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideFolderCode } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
	selector: 'spartan-empty-preview',
	imports: [NgIcon, HlmIcon, HlmButton, HlmEmptyImports],
	providers: [provideIcons({ lucideFolderCode, lucideArrowUpRight })],
	template: `
		<div hlmEmpty>
			<div hlmEmptyHeader>
				<div hlmEmptyMedia variant="icon">
					<ng-icon name="lucideFolderCode" />
				</div>
				<div hlmEmptyTitle>No Projects Yet</div>
				<div hlmEmptyDescription>
					You haven&apos;t created any projects yet. Get started by creating your first project.
				</div>
			</div>
			<div hlmEmptyContent>
				<div class="flex gap-2">
					<button hlmBtn>Create Project</button>
					<button hlmBtn variant="outline">Import Project</button>
				</div>
			</div>
			<button hlmBtn class="text-muted-foreground" variant="link" size="sm">
				Learn More
				<ng-icon hlm name="lucideArrowUpRight" size="sm" />
			</button>
		</div>
	`,
})
export class EmptyPreview {}

export const defaultImports = `
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
`;

export const defaultSkeleton = `
<div hlmEmpty>
	<div hlmEmptyHeader>
		<div hlmEmptyMedia variant="icon">
			<ng-icon name="lucideFolderCode" />
		</div>
		<div hlmEmptyTitle>No Projects Yet</div>
		<div hlmEmptyDescription>
			You haven&apos;t created any projects yet. Get started by creating your first project.
		</div>
	</div>
	<div hlmEmptyContent>
		<div class="flex gap-2">
			<button hlmBtn>Create Project</button>
			<button hlmBtn variant="outline">Import Project</button>
		</div>
	</div>
</div>
`;
