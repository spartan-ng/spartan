import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { HlmTableComponent, HlmTdComponent, HlmThComponent, HlmTrowComponent } from '@spartan-ng/ui-table-helm';
import { hlmH4 } from '@spartan-ng/ui-typography-helm';
import { map } from 'rxjs/operators';
import { ApiDocsService } from '../../../core/services/api-docs.service';

@Component({
	selector: 'spartan-ui-api-docs',
	standalone: true,
	imports: [HlmTableComponent, HlmTrowComponent, HlmThComponent, HlmTdComponent],
	template: `
		@if (componentDocs() && componentEntries() && componentEntries().length > 0) {
			@for (entry of componentEntries(); track entry) {
				<h4 class="${hlmH4} mb-2 mt-6 pt-12" [id]="entry.toLowerCase()">{{ entry }}</h4>
				<p>Selector: {{ componentItems()[entry].selector }}</p>
				@if (componentItems()[entry].exportAs) {
					<p>{{ componentItems()[entry].exportAs }}</p>
				}
				@if (componentItems()[entry].inputs && componentItems()[entry].inputs.length > 0) {
					<h4 class="${hlmH4} mb-2 mt-6">Inputs</h4>
					<hlm-table class="min-w-[400px]">
						<hlm-trow>
							<hlm-th class="flex-1">Prop</hlm-th>
							<hlm-th class="flex-1">Type</hlm-th>
							<hlm-th class="flex-1">Default</hlm-th>
							<hlm-th class="flex-1 whitespace-nowrap">Description</hlm-th>
						</hlm-trow>

						@for (input of componentItems()[entry].inputs; track input.name + $index) {
							<hlm-trow>
								<hlm-td truncate class="flex-1 font-medium">{{ input?.name }}</hlm-td>
								<hlm-td class="flex-1">{{ input?.type }}</hlm-td>
								<hlm-td class="flex-1">
									@if (input?.defaultValue) {
										{{ input?.defaultValue }}
									} @else {
										<span class="sr-hidden">-</span>
									}
								</hlm-td>
								<hlm-td class="flex-1">
									@if (input?.description) {
										{{ input?.description }}
									} @else {
										<span class="sr-hidden">-</span>
									}
								</hlm-td>
							</hlm-trow>
						}
					</hlm-table>
				}

				@if (componentItems()[entry].outputs && componentItems()[entry].outputs.length > 0) {
					<h4 class="${hlmH4} mb-2 mt-6">Outputs</h4>
					<hlm-table class="min-w-[400px]">
						<hlm-trow>
							<hlm-th class="flex-1">Prop</hlm-th>
							<hlm-th class="flex-1">Type</hlm-th>
							<hlm-th class="flex-1 whitespace-nowrap">Default</hlm-th>
						</hlm-trow>

						@for (output of componentItems()[entry].outputs; track output.name + $index) {
							<hlm-trow>
								<hlm-td truncate class="flex-1 font-medium">{{ output?.name }}</hlm-td>
								<hlm-td class="flex-1">{{ output?.type }}</hlm-td>
								<hlm-td class="flex-1">
									@if (output?.description) {
										{{ output?.description }}
									} @else {
										<span class="sr-hidden">-</span>
									}
								</hlm-td>
							</hlm-trow>
						}
					</hlm-table>
				}
			}
		}
	`,
})
export class UIApiDocsComponent {
	private readonly _apiDocsService = inject(ApiDocsService);
	private readonly _route = inject(ActivatedRoute);
	protected primitive = toSignal(this._route.data.pipe(map((data) => data?.['api'])));

	public docType = input.required<'brain' | 'ui'>();

	protected componentDocs = computed(() => this._apiDocsService.getComponentDocs(this.primitive())());
	protected componentItems = computed(() => this.componentDocs()?.[this.docType()] ?? {});
	protected componentEntries = computed(() => Object.keys(this.componentItems() ?? []));
}
