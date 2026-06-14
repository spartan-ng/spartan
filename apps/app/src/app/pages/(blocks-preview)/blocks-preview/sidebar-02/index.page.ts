import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebar02 } from './sidebar-02/app-sidebar';

@Component({
	selector: 'spartan-sidebar-02-preview',
	imports: [HlmSidebarImports, AppSidebar02, HlmSeparatorImports],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	styleUrl: '../../blocks-preview-default.css',
	template: `
		<div hlmSidebarWrapper>
			<spartan-app-sidebar-02 />
			<main hlmSidebarInset>
				<header class="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<button hlmSidebarTrigger class="-ml-1"></button>
					<hlm-separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
					<div class="flex items-center gap-2">
						<span class="text-muted-foreground text-sm">Building Your Application</span>
						<span class="text-muted-foreground text-sm">/</span>
						<span class="text-sm">Data Fetching</span>
					</div>
				</header>
				<div class="flex flex-1 flex-col gap-4 p-4">
					@for (i of rows; track i) {
						<div class="bg-muted/50 h-12 w-full rounded-lg"></div>
					}
				</div>
			</main>
		</div>
	`,
})
export default class Sidebar02Page {
	public readonly rows = Array.from({ length: 24 });
}
