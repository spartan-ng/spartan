import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmScrollArea } from '@spartan-ng/helm/scroll-area';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SideNavContent } from './side-nav-content';

@Component({
	selector: 'spartan-side-nav',
	imports: [HlmScrollArea, NgScrollbarModule, SideNavContent],
	host: {
		class: 'fixed text-sm top-12 px-2 pt-6 pb-12 flex z-30 -ml-2 hidden w-full shrink-0 md:sticky md:block',
	},
	template: `
		<ng-scrollbar hlm visibility="hover" class="h-[calc(100vh-3.5rem)]">
			<spartan-side-nav-content />
		</ng-scrollbar>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNav {}
