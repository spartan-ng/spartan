import { Component } from '@angular/core';
import { HlmScrollAreaDirective } from '@spartan-ng/helm/scroll-area';
import { HlmSeparatorDirective } from '@spartan-ng/helm/separator';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
	selector: 'spartan-scroll-area-preview',
	imports: [HlmSeparatorDirective, HlmScrollAreaDirective, NgScrollbarModule],
	template: `
		<ng-scrollbar hlm class="border-border h-72 w-48 rounded-md border" visibility="hover">
			<div class="p-4">
				<h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
				@for (tag of tags; track tag) {
					<div class="text-sm">
						{{ tag }}
						<div hlmSeparator class="my-2"></div>
					</div>
				}
			</div>
		</ng-scrollbar>
	`,
})
export class ScrollAreaPreviewComponent {
	public tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);
}

export const defaultImports = `
import { HlmScrollAreaDirective } from '@spartan-ng/helm/scroll-area';
`;
export const defaultSkeleton = `
<ng-scrollbar hlm class="border w-72 rounded-md border-border">
  <div class='p-6 whitespace-nowrap'>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium architecto,<br>
    asperiores beatae consequuntur dolor ducimus et exercitationem facilis fugiat magni<br>
    nisi officiis quibusdam rem repellat reprehenderit totam veritatis voluptatibus! Nobis.
  </div>
</ng-scrollbar>
`;
