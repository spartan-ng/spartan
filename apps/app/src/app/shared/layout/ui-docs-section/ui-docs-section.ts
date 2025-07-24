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
					<code class="${hlmCode}">{{ _componentItems()[entry].selector }}</code>
				</p>
				@if (_componentItems()[entry].exportAs) {
					<p>
						ExportAs:
						<code class="${hlmCode}">{{ _componentItems()[entry].exportAs }}</code>
					</p>
				}

				@if (_componentItems()[entry].inputs && _componentItems()[entry].inputs.length > 0) {
					<spartan-ui-api-docs-table
						title="Inputs"
						[rows]="_componentItems()[entry].inputs"
						[columns]="[
							{ label: 'Prop', key: 'name', class: 'font-medium' },
							{ label: 'Type', key: 'type' },
							{ label: 'Default', key: 'defaultValue' },
							{ label: 'Description', key: 'description' },
						]"
					/>
				}

				@if (_componentItems()[entry].models && _componentItems()[entry].models.length > 0) {
					<spartan-ui-api-docs-table
						title="Models"
						[rows]="_componentItems()[entry].models"
						[columns]="[
							{ label: 'Prop', key: 'name', class: 'font-medium' },
							{ label: 'Type', key: 'type' },
							{ label: 'Default', key: 'defaultValue' },
							{ label: 'Description', key: 'description' },
						]"
					/>
				}

				@if (_componentItems()[entry].outputs && _componentItems()[entry].outputs.length > 0) {
					<spartan-ui-api-docs-table
						title="Outputs"
						[rows]="_componentItems()[entry].outputs"
						[columns]="[
							{ label: 'Prop', key: 'name', class: 'font-medium' },
							{ label: 'Type', key: 'type' },
							{ label: 'Description', key: 'description' },
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
}
