import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockViewer } from '@spartan-ng/app/app/shared/blocks/block-viewer';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/blocks - Signup', 'Signup blocks using spartan/ui primitives'),
	title: 'spartan/blocks - Signup',
};

@Component({
	selector: 'spartan-signup',
	imports: [BlockViewer],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex flex-col',
	},
	template: `
		<spartan-block-viewer block="signup-simple" title="A simple signup form" id="signup-1" />
		<spartan-block-viewer block="signup-two-column" title="A two-column signup form" id="signup-2" />
	`,
})
export default class SignupPage {}
