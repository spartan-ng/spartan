import { Component, computed, input } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { type Row } from '@tanstack/angular-table';
import type { Task } from '../services/tasks.models';

@Component({
	selector: 'spartan-title-cell',
	imports: [HlmBadgeImports],
	template: `
		<div hlmBadge variant="outline">
			{{ _data().type }}
		</div>
		{{ _data().title }}
	`,
})
export class TitleCell {
	readonly row = input.required<Row<{}, Task>>();

	protected readonly _data = computed(() => this.row().original);
}
