// Adapted from Base UI (https://github.com/mui/base-ui), MIT License, Copyright (c) 2019 Material-UI SAS.
import { Directive, inject } from '@angular/core';
import { BrnDrawerProvider } from './brn-drawer-provider';

/** An element placed behind `brnDrawerIndent`, shown while a drawer is open. */
@Directive({
	selector: '[brnDrawerIndentBackground],brn-drawer-indent-background',
	exportAs: 'brnDrawerIndentBackground',
	host: {
		'[attr.data-active]': '_provider?.active() ? "" : null',
		'[attr.data-inactive]': '_provider?.active() ? null : ""',
	},
})
export class BrnDrawerIndentBackground {
	protected readonly _provider = inject(BrnDrawerProvider, { optional: true });
}
