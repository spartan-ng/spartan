import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockViewer } from '@spartan-ng/app/app/shared/blocks/block-viewer';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmCode } from '@spartan-ng/helm/typography';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/blocks - Rich Filter', 'Rich Filter blocks using spartan/ui primitives'),
	title: 'spartan/blocks - Rich Filter',
};

@Component({
	selector: 'spartan-rich-filter',
	imports: [BlockViewer],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex flex-col',
	},
	template: `
		<spartan-block-viewer block="rich-filter" title="Functional Rich filter" id="rich-filter-1">
			<!-- <code class="${hlmCode}">[--header-height:--spacing(14)]</code> -->
			<p class="text-muted-foreground max-w-3xl text-sm text-pretty">
				The rich filter block provides users with an intuitive interface
				for creating complex filter criteria.
				It allows users to add multiple filter fields, each with its own set of
				operators and input controls.
				The block supports various field types, such as text, number, date, and select.
				The data is exposed as a reactive stream
			</p>
		</spartan-block-viewer>
	`,
})
export default class RichFilterPage {}
