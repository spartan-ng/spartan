import { Component, input } from '@angular/core';
import {
	HlmCaptionComponent,
	HlmTableComponent,
	HlmTdComponent,
	HlmThComponent,
	HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';

export type PropDetails = { name: string; description?: string; default?: string; type: string };

const content =
	'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border border-border';

@Component({
	selector: 'spartan-api-table',
	standalone: true,
	imports: [HlmTableComponent, HlmTrowComponent, HlmThComponent, HlmTdComponent, HlmCaptionComponent],
	host: {
		class: 'block',
	},
	template: `
		<hlm-table class="${content} min-w-[400px]">
			<hlm-trow>
				<hlm-th class="flex-1">Prop</hlm-th>
				<hlm-th class="flex-1">Type</hlm-th>
				<hlm-th class="flex-1 whitespace-nowrap">Default</hlm-th>
			</hlm-trow>
			@for (prop of api(); track prop.name) {
				<hlm-trow>
					<hlm-td truncate class="flex-1 font-medium">{{ prop.name }}</hlm-td>
					<hlm-td class="flex-1">{{ prop.type }}</hlm-td>
					<hlm-td class="flex-1 whitespace-nowrap">{{ prop.default || '-' }}</hlm-td>
				</hlm-trow>
			}
		</hlm-table>
	`,
})
export class APITableComponent {
	protected readonly api = input<PropDetails[]>([]);
}
