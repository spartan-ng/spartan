import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFile, lucideFolder } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

type FileTreeItem = { name: string; items?: FileTreeItem[] };

const FILE_TREE: FileTreeItem[] = [
	{
		name: 'components',
		items: [
			{
				name: 'ui',
				items: [
					{ name: 'button.ts' },
					{ name: 'card.ts' },
					{ name: 'dialog.ts' },
					{ name: 'input.ts' },
					{ name: 'select.ts' },
					{ name: 'table.ts' },
				],
			},
			{ name: 'login-form.ts' },
			{ name: 'register-form.ts' },
		],
	},
	{
		name: 'lib',
		items: [{ name: 'utils.ts' }, { name: 'cn.ts' }, { name: 'api.ts' }],
	},
	{
		name: 'services',
		items: [{ name: 'media-query.ts' }, { name: 'auth.ts' }, { name: 'local-storage.ts' }],
	},
	{
		name: 'types',
		items: [{ name: 'index.d.ts' }, { name: 'api.d.ts' }],
	},
	{
		name: 'public',
		items: [{ name: 'favicon.ico' }, { name: 'logo.svg' }, { name: 'images' }],
	},
	{ name: 'app.ts' },
	{ name: 'layout.ts' },
	{ name: 'globals.css' },
	{ name: 'package.json' },
	{ name: 'tsconfig.json' },
	{ name: 'README.md' },
	{ name: '.gitignore' },
];

@Component({
	selector: 'spartan-file-tree-node',
	imports: [HlmCollapsibleImports, HlmButtonImports, NgIcon, FileTreeNode],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (item().items; as children) {
			<hlm-collapsible class="w-full">
				<button
					hlmCollapsibleTrigger
					hlmBtn
					variant="ghost"
					size="sm"
					class="group hover:bg-accent hover:text-accent-foreground w-full justify-start transition-none"
				>
					<ng-icon name="lucideChevronRight" class="transition-transform group-data-[state=open]:rotate-90" />
					<ng-icon name="lucideFolder" />
					{{ item().name }}
				</button>
				<hlm-collapsible-content class="mt-1 ml-5 flex flex-col gap-1">
					@for (child of children; track child.name) {
						<spartan-file-tree-node [item]="child" />
					}
				</hlm-collapsible-content>
			</hlm-collapsible>
		} @else {
			<button hlmBtn variant="link" size="sm" class="text-foreground w-full justify-start gap-2">
				<ng-icon name="lucideFile" />
				<span>{{ item().name }}</span>
			</button>
		}
	`,
})
export class FileTreeNode {
	public readonly item = input.required<FileTreeItem>();
}

@Component({
	selector: 'spartan-collapsible-file-tree',
	imports: [HlmCollapsibleImports, HlmButtonImports, HlmCardImports, HlmTabsImports, FileTreeNode],
	providers: [provideIcons({ lucideChevronRight, lucideFile, lucideFolder })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'mx-auto w-full max-w-xs' },
	template: `
		<hlm-card size="sm">
			<hlm-card-header>
				<hlm-tabs tab="explorer">
					<hlm-tabs-list class="w-full">
						<button hlmTabsTrigger="explorer">Explorer</button>
						<button hlmTabsTrigger="outline">Outline</button>
					</hlm-tabs-list>
				</hlm-tabs>
			</hlm-card-header>
			<div hlmCardContent>
				<div class="flex flex-col gap-1">
					@for (item of fileTree; track item.name) {
						<spartan-file-tree-node [item]="item" />
					}
				</div>
			</div>
		</hlm-card>
	`,
})
export class CollapsibleFileTree {
	public readonly fileTree = FILE_TREE;
}
