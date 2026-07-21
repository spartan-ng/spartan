import type { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, effect, inject, input, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { injectBrnPaginationSizeSource } from './brn-pagination-size-token';

@Directive({
	selector: '[brnPaginationSizeSync]',
})
export class BrnPaginationSizeSync {
	private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);
	private readonly _source = injectBrnPaginationSizeSource();

	/** Guards against firing a navigation for the initial (non user-driven) itemsPerPage value. */
	private _skipNextSizeNavigation = true;
	private _wasSizeParamsEnabled = false;

	/**
	 * Whether to sync the selected page size to a `size` query param.
	 * @default false
	 */
	public readonly enableSizeParams = input<boolean, BooleanInput>(false, {
		transform: booleanAttribute,
	});

	/**
	 * The query parameter name used to store the selected page size.
	 * @default 'size'
	 */
	public readonly sizeParamName = input<string>('size');

	constructor() {
		effect(() => {
			const size = this._source.itemsPerPage();
			const enableSizeParams = this.enableSizeParams();
			const sizeParamName = this.sizeParamName();

			if (this._skipNextSizeNavigation) {
				this._skipNextSizeNavigation = false;
				this._wasSizeParamsEnabled = enableSizeParams;
				return;
			}

			if (!enableSizeParams) {
				if (this._wasSizeParamsEnabled) {
					untracked(() => {
						this._router.navigate([], {
							relativeTo: this._route,
							queryParams: { [sizeParamName]: null },
							queryParamsHandling: 'merge',
						});
					});
				}

				this._wasSizeParamsEnabled = false;
				return;
			}

			this._wasSizeParamsEnabled = true;

			untracked(() => {
				this._router.navigate([], {
					relativeTo: this._route,
					queryParams: { [sizeParamName]: size },
					queryParamsHandling: 'merge',
				});
			});
		});
	}
}
