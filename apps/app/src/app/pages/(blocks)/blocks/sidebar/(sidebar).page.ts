import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGithub } from '@ng-icons/lucide';
import { BlockPreview } from '@spartan-ng/app/app/shared/blocks/block-preview';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { hlmCode } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/blocks - Sidebar', 'Sidebar blocks using spartan/ui primitives'),
	title: 'spartan/blocks - Sidebar',
};

@Component({
	selector: 'spartan-sidebar',
	imports: [BlockPreview, RouterLink, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideGithub })],
	template: `
		<div id="sidebar-1" class="flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<a
					routerLink="."
					fragment="sidebar-1"
					class="flex-1 text-center text-sm font-medium underline-offset-2 hover:underline md:flex-auto md:text-left"
				>
					A sidebar with a sticky header
				</a>
				<a
					hlmBtn
					size="sm"
					href="https://github.com/spartan-ng/spartan/blob/main/apps/app/src/app/pages/(sidebar-preview)/sidebar-preview/sidebar-sticky-header.page.ts"
					target="_blank"
				>
					Open in
					<ng-icon name="lucideGithub" />
				</a>
			</div>

			<p class="text-muted-foreground text-sm">
				Setup a CSS variable for the header height by adding
				<code class="${hlmCode}">[--header-height:--spacing(14)]</code>
				to the body or page container and use
				<code class="${hlmCode}">h-(--header-height)</code>
				to set the height of your header. This variable is then used to offset the sidebar to account for the sticky
				header height.
			</p>

			<spartan-block-preview path="sidebar-preview" name="sidebar-sticky-header" />
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SidebarPage {}
