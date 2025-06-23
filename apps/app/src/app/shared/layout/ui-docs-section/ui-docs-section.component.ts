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
					<code class="${hlmCode}">{{ componentItems()[entry].selector }}</code>
				</p>
				@if (componentItems()[entry].exportAs) {
					<p>
						ExportAs:
						<code class="${hlmCode}">{{ componentItems()[entry].exportAs }}</code>
					</p>
				}

				@if (componentItems()[entry].inputs && componentItems()[entry].inputs.length > 0) {
					<spartan-ui-api-docs-table
						title="Inputs"
						[rows]="componentItems()[entry].inputs"
						[columns]="[
							{ label: 'Prop', key: 'name', class: 'font-medium' },
							{ label: 'Type', key: 'type' },
							{ label: 'Default', key: 'defaultValue' },
							{ label: 'Description', key: 'description' },
						]"
					/>
				}

				@if (componentItems()[entry].models && componentItems()[entry].models.length > 0) {
					<spartan-ui-api-docs-table
						title="Models"
						[rows]="componentItems()[entry].models"
						[columns]="[
							{ label: 'Prop', key: 'name', class: 'font-medium' },
							{ label: 'Type', key: 'type' },
							{ label: 'Default', key: 'defaultValue' },
							{ label: 'Description', key: 'description' },
						]"
					/>
				}

				@if (componentItems()[entry].outputs && componentItems()[entry].outputs.length > 0) {
					<spartan-ui-api-docs-table
						title="Outputs"
						[rows]="componentItems()[entry].outputs"
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
export class UIApiDocsComponent {
	private readonly _apiDocsService = inject(ApiDocsService);
	private readonly _route = inject(ActivatedRoute);
	protected primitive = toSignal(this._route.data.pipe(map((data) => data?.['api'])));

	public docType = input.required<SubTypeRecord>();

	protected componentDocs = computed(() => this._apiDocsService.getComponentDocs(this.primitive())());
	protected componentItems = computed(() => this.componentDocs()?.[this.docType()] ?? {});
	protected componentEntries = computed(() => Object.keys(this.componentItems() ?? []));
}
