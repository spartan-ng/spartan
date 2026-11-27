import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TypesetStandalonePreview } from '@spartan-ng/app/app/pages/(typeset)/components/typeset-standalone-preview';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Typeset preview' },
	meta: [
		...metaWith('spartan - Typeset notes preview', 'Typeset content rendered with the preset from the query string.'),
		{ name: 'robots', content: 'noindex' },
	],
	title: 'spartan - Typeset notes preview',
};

@Component({
	selector: 'spartan-typeset-preview-notes',
	imports: [TypesetStandalonePreview],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	template: `
		<spartan-typeset-standalone-preview item="notes" />
	`,
})
export default class TypesetPreviewNotesPage {}
