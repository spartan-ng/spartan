import { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

export const routeMeta: RouteMeta = {
	meta: metaWith(
		'spartan/examples/dashboard - Dashboard Example',
		"SPARTAN comes with helpful directives that enforce consistent styling across your application's typography.",
	),
	title: 'spartan/examples/dashboard - Dashboard Example',
};

@Component({
	selector: 'spartan-dashboard-example',
	imports: [HlmSidebarImports],
	template: `
		<div class="relative hidden aspect-[4/2.5] w-full overflow-hidden rounded-lg border md:block">
			<div class="bg-background absolute inset-0 hidden md:block">
				<iframe [src]="_iframeSrc()" class="size-full"></iframe>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardPage {
	private readonly _sanitizer = inject(DomSanitizer);
	public readonly name = input.required<string>();
	protected readonly _iframeSrc = computed(() =>
		this._sanitizer.bypassSecurityTrustResourceUrl('/sidebar-preview/dashboard-layout'),
	);
}
