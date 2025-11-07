import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

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
export default class DashboardExample {
	private readonly _sanitizer = inject(DomSanitizer);
	protected readonly _iframeSrc = computed(() =>
		this._sanitizer.bypassSecurityTrustResourceUrl('/sidebar-preview/dashboard-layout'),
	);
}
