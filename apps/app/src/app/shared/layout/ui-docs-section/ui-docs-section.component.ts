import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SubTypeRecord } from '@spartan-ng/app/app/core/models/ui-docs.model';
import { hlmCode, hlmH4 } from '@spartan-ng/helm/typography';
import { map } from 'rxjs/operators';
import { ApiDocsService } from '../../../core/services/api-docs.service';
import { UIApiDocsTableComponent } from '../ui-api-docs-table/ui-api-docs-table.component';

@Component({
	selector: 'spartan-ui-api-docs',
	imports: [UIApiDocsTableComponent],
	template: `
		@if (componentDocs() && componentEntries() && componentEntries().length > 0) {
			@for (entry of componentEntries(); track entry) {
				<h4 class="${hlmH4} mb-2 mt-6 pt-12" [id]="entry.toLowerCase()">{{ entry }}</h4>
				<p>
					Selector:
					<code class="${hlmCode}">{{ transformedComponentItems()[entry].selector }}</code>
				</p>
				@if (transformedComponentItems()[entry].exportAs) {
					<p>
						ExportAs:
						<code class="${hlmCode}">{{ transformedComponentItems()[entry].exportAs }}</code>
					</p>
				}

				@if (transformedComponentItems()[entry].inputs && transformedComponentItems()[entry].inputs.length > 0) {
					<spartan-ui-api-docs-table
						title="Inputs"
						[rows]="transformedComponentItems()[entry].inputs"
						[columns]="[
							{ label: 'Prop', key: 'name', class: 'w-[200px] flex-1 font-medium' },
							{ label: 'Type', key: 'type', class: 'w-[100px] flex-1 flex-wrap' },
							{ label: 'Default', key: 'defaultValue', class: 'w-[100px] flex-1' },
							{ label: 'Description', key: 'description', class: 'flex-1' },
						]"
					/>
				}

				@if (transformedComponentItems()[entry].models && transformedComponentItems()[entry].models.length > 0) {
					<spartan-ui-api-docs-table
						title="Models"
						[rows]="transformedComponentItems()[entry].models"
						[columns]="[
							{ label: 'Prop', key: 'name', class: 'w-[200px] flex-1 font-medium' },
							{ label: 'Type', key: 'type', class: 'w-[100px] flex-1 flex-wrap' },
							{ label: 'Default', key: 'defaultValue', class: 'w-[100px] flex-1' },
							{ label: 'Description', key: 'description', class: 'flex-1' },
						]"
					/>
				}

				@if (transformedComponentItems()[entry].outputs && transformedComponentItems()[entry].outputs.length > 0) {
					<spartan-ui-api-docs-table
						title="Outputs"
						[rows]="transformedComponentItems()[entry].outputs"
						[columns]="[
							{ label: 'Prop', key: 'name', class: 'w-[200px] flex-1 font-medium' },
							{ label: 'Type', key: 'type', class: 'w-[100px] flex-1 flex-wrap' },
							{ label: 'Default', key: 'defaultValue', class: 'w-[100px] flex-1' },
							{ label: 'Description', key: 'description', class: 'flex-1' },
						]"
					/>
				}
			}
		}
	`,
})
export class UIApiDocsComponent {
	private readonly _apiDocsService = inject(ApiDocsService);
	private readonly _route = inject(ActivatedRoute);
	protected primitive = toSignal(this._route.data.pipe(map((data) => data?.['api'])));

	public docType = input.required<SubTypeRecord>();

	protected componentDocs = computed(() => this._apiDocsService.getComponentDocs(this.primitive())());
	protected componentItems = computed(() => this.componentDocs()?.[this.docType()] ?? {});
	protected componentEntries = computed(() => Object.keys(this.componentItems() ?? []));

	protected transformedComponentItems = computed(() => {
		const items = this.componentItems();
		if (!items) return {};

		const transformed: any = {};
		for (const [key, value] of Object.entries(items)) {
			transformed[key] = {
				...value,
				inputs: value.inputs?.map((input: any) => ({
					...input,
					name: input.required ? `${input.name}<span class="text-destructive">*</span> (required)` : input.name,
				})),
				models: value.models?.map((model: any) => ({
					...model,
					name: model.required ? `${model.name}<span class="text-destructive">*</span> (required)` : model.name,
				})),
				outputs: value.outputs?.map((output: any) => ({
					...output,
					name: output.required ? `${output.name}<span class="text-destructive">*</span> (required)` : output.name,
				})),
			};
		}
		return transformed;
	});
}
