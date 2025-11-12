import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import type { LibraryType } from '@spartan-ng/app/app/core/models/ui-docs.model';
import { SectionSubSubHeading } from '@spartan-ng/app/app/shared/layout/section-sub-sub-heading';
import { hlmCode } from '@spartan-ng/helm/typography';
import { map } from 'rxjs/operators';
import { ApiDocsService } from '../../../core/services/api-docs.service';
import { UIApiDocsTable } from '../ui-api-docs-table/ui-api-docs-table';

@Component({
	selector: 'spartan-ui-api-docs',
	imports: [UIApiDocsTable, SectionSubSubHeading],
	host: {
		class: 'block ',
	},
	template: `
		@if (_componentDocs() && _componentEntries() && _componentEntries().length > 0) {
			@for (entry of _componentEntries(); track entry) {
				@let properties = _transformedComponentItems()[entry];
				<h4 spartanH4 [id]="entry.toLowerCase()">{{ entry }}</h4>
				@let selector = properties.selector;
				@if (selector) {
					<p>
						Selector:
						<code class="${hlmCode}">{{ selector }}</code>
					</p>
				}
				@if (properties.exportAs) {
					<p>
						ExportAs:
						<code class="${hlmCode}">{{ properties.exportAs }}</code>
					</p>
				}

				@if (properties.inputs && properties.inputs.length > 0) {
					<spartan-ui-api-docs-table
						title="Inputs"
						[rows]="properties.inputs"
						[columns]="[
							{ label: 'Prop', key: 'name', class: 'font-medium' },
							{ label: 'Type', key: 'type' },
							{ label: 'Default', key: 'defaultValue' },
							{ label: 'Description', key: 'description', class: 'whitespace-pre' },
						]"
					/>
				}

				@if (properties.outputs && properties.outputs.length > 0) {
					<spartan-ui-api-docs-table
						title="Outputs"
						[rows]="properties.outputs"
						[columns]="[
							{ label: 'Prop', key: 'name', class: 'font-medium' },
							{ label: 'Type', key: 'type' },
							{ label: 'Default', key: 'defaultValue' },
							{ label: 'Description', key: 'description', class: 'whitespace-pre' },
						]"
					/>
				}
			}
		}
	`,
})
export class UIApiDocs {
	private readonly _apiDocsService = inject(ApiDocsService);
	private readonly _route = inject(ActivatedRoute);
	protected readonly _primitive = toSignal(this._route.data.pipe(map((data) => data?.['api'])));

	public readonly docType = input.required<LibraryType>();

	protected readonly _componentDocs = computed(() => this._apiDocsService.getComponentDocs(this._primitive())());
	protected readonly _componentItems = computed(() => this._componentDocs()?.[this.docType()] ?? {});
	protected readonly _componentEntries = computed(() => Object.keys(this._componentItems() ?? []));

	protected readonly _transformedComponentItems = computed(() => {
		const items = this._componentItems();
		if (!items) return {};

		const transformed: any = {};
		for (const [key, value] of Object.entries(items)) {
			// Transform inputs to include models
			const transformedInputs = [
				...(value.inputs?.map((input: any) => ({
					...input,
					name: input.required ? `${input.name}<span class="text-destructive">*</span> (required)` : input.name,
				})) || []),
				...(value.models?.map((model: any) => ({
					...model,
					name: model.required ? `${model.name}<span class="text-destructive">*</span> (required)` : model.name,
				})) || []),
			];

			// Transform outputs to include models with "Changed" suffix
			const transformedOutputs = [
				...(value.outputs?.map((output: any) => ({
					...output,
					name: output.required ? `${output.name}<span class="text-destructive">*</span> (required)` : output.name,
				})) || []),
				...(value.models?.map((model: any) => ({
					...model,
					name: model.required
						? `${model.name}Changed<span class="text-destructive">*</span> (required)`
						: `${model.name}Changed`,
				})) || []),
			];

			transformed[key] = {
				...value,
				inputs: transformedInputs,
				outputs: transformedOutputs,
			};
		}
		return transformed;
	});
}
