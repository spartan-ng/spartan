import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { LibraryType } from '@spartan-ng/app/app/core/models/ui-docs.model';
import { hlmCode, hlmH4 } from '@spartan-ng/helm/typography';
import { map } from 'rxjs/operators';
import { ApiDocsService } from '../../../core/services/api-docs.service';
import { UIApiDocsTable } from '../ui-api-docs-table/ui-api-docs-table';

@Component({
	selector: 'spartan-ui-api-docs',
	imports: [UIApiDocsTable],
	template: `
		@if (_componentDocs() && _componentEntries() && _componentEntries().length > 0) {
			@for (entry of _componentEntries(); track entry) {
				<h4 class="${hlmH4} mb-2 mt-6 pt-12" [id]="entry.toLowerCase()">{{ entry }}</h4>
				<p>
					Selector:
					<code class="${hlmCode}">{{ _transformedComponentItems()[entry].selector }}</code>
				</p>
				@if (_transformedComponentItems()[entry].exportAs) {
					<p>
						ExportAs:
						<code class="${hlmCode}">{{ _transformedComponentItems()[entry].exportAs }}</code>
					</p>
				}

				@if (_transformedComponentItems()[entry].inputs && _transformedComponentItems()[entry].inputs.length > 0) {
					<spartan-ui-api-docs-table
						title="Inputs"
						[rows]="_transformedComponentItems()[entry].inputs"
						[columns]="[
							{ label: 'Prop', key: 'name', class: 'font-medium' },
							{ label: 'Type', key: 'type' },
							{ label: 'Default', key: 'defaultValue' },
							{ label: 'Description', key: 'description', class: 'whitespace-pre' },
						]"
					/>
				}

				@if (_transformedComponentItems()[entry].outputs && _transformedComponentItems()[entry].outputs.length > 0) {
					<spartan-ui-api-docs-table
						title="Outputs"
						[rows]="_transformedComponentItems()[entry].outputs"
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
