import type { RouteMeta } from '@analogjs/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlockViewer } from '@spartan-ng/app/app/shared/blocks/block-viewer';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/blocks - Login', 'Login blocks using spartan/ui primitives'),
	title: 'spartan/blocks - Login',
};

@Component({
	selector: 'spartan-login',
	imports: [BlockViewer],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'flex flex-col',
	},
	template: `
		<spartan-block-viewer
			block="login-simple-reactive-form"
			title="A simple login form (Reactive forms)"
			id="login-1"
		/>
		<spartan-block-viewer
			block="login-two-column-reactive-form"
			title="A two-column login form (Reactive forms)"
			id="login-2"
		/>
	`,
})
export default class LoginPage {}
