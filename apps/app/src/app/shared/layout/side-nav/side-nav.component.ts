import { Component } from '@angular/core';
import { HlmScrollAreaDirective } from '@spartan-ng/ui-scrollarea-helm';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SideNavContentComponent } from './side-nav-content.component';

@Component({
	selector: 'spartan-side-nav',
	imports: [HlmScrollAreaDirective, NgScrollbarModule, SideNavContentComponent],
	host: {
		class: 'fixed text-sm top-12 px-2 pt-6 pb-12 flex z-30 -ml-2 hidden w-full shrink-0 md:sticky md:block',
	},
	template: `
		<ng-scrollbar hlm visibility="hover" class="h-[calc(100vh-3.5rem)]">
			<spartan-side-nav-content />
		</ng-scrollbar>
	`,
})
export class SideNavComponent {}
