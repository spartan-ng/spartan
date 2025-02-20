import { Component } from '@angular/core';
import {
	HlmCardContentDirective,
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardFooterDirective,
	HlmCardHeaderDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmSkeletonComponent } from '@spartan-ng/ui-skeleton-helm';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'analog-trpc-note-skeleton',
	host: {
		class: 'block',
	},
	hostDirectives: [HlmCardDirective],
	imports: [
		HlmCardContentDirective,
		HlmCardDescriptionDirective,
		HlmCardFooterDirective,
		HlmCardHeaderDirective,
		HlmSkeletonComponent,
	],
	template: `
		<div hlmCardHeader>
			<hlm-skeleton class="h-[25px] w-[150px]" />
			<hlm-skeleton hlmCardDescription class="h-[20px] w-[100px]" />
		</div>
		<div hlmCardContent class="flex flex-col space-y-2">
			<hlm-skeleton class="h-[25px] w-full" />
			<hlm-skeleton class="h-[25px] w-full" />
		</div>
		<div hlmCardFooter class="justify-end">
			<hlm-skeleton class="h-[40px] w-[110px]" />
		</div>
	`,
})
export class NoteSkeletonComponent {}
