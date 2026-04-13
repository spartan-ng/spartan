// src/app/directives/hlm-table-directives.ts
import { computed, Directive, inject, InjectionToken, input, type ValueProvider } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

// Configuration Interface and InjectionToken
export const HlmTableConfigToken = new InjectionToken<HlmTableVariant>('HlmTableConfig');
export interface HlmTableVariant {
	tableContainer: string;
	table: string;
	thead: string;
	tbody: string;
	tfoot: string;
	tr: string;
	th: string;
	td: string;
	caption: string;
}

export const HlmTableVariantDefault: HlmTableVariant = {
	tableContainer: 'spartan-table-container',
	table: 'spartan-table',
	thead: 'spartan-table-header',
	tbody: 'spartan-table-body',
	tfoot: 'spartan-table-footer',
	tr: 'spartan-table-row has-aria-expanded:bg-muted/50',
	th: 'spartan-table-head',
	td: 'spartan-table-cell',
	caption: 'spartan-table-caption',
};

export function provideHlmTableConfig(config: Partial<HlmTableVariant>): ValueProvider {
	return {
		provide: HlmTableConfigToken,
		useValue: { ...HlmTableVariantDefault, ...config },
	};
}

export function injectHlmTableConfig(): HlmTableVariant {
	return inject(HlmTableConfigToken, { optional: true }) ?? HlmTableVariantDefault;
}

@Directive({
	selector: 'div[hlmTableContainer]',
	host: { 'data-slot': 'table-container' },
})
export class HlmTableContainer {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();

	constructor() {
		classes(() => (this._globalOrDefaultConfig ? this._globalOrDefaultConfig.tableContainer.trim() : ''));
	}
}

/**
 * Directive to apply Shadcn-like styling to a <table> element.
 * It resolves and provides base classes for its child table elements.
 * If a table has the `hlmTable` attribute, it will be styled with the provided variant.
 * The other table elements will check if a parent table has the `hlmTable` attribute and will be styled accordingly.
 */
@Directive({
	selector: 'table[hlmTable]',
	host: { 'data-slot': 'table' },
})
export class HlmTable {
	/** Input to configure the variant of the table, this input has the highest priority. */
	public readonly userVariant = input<Partial<HlmTableVariant> | string>({}, { alias: 'hlmTable' });

	/** Global or default configuration provided by injectHlmTableConfig() */
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();

	// Protected variant that resolves user input to a full HlmTableVariant
	protected readonly _variant = computed<HlmTableVariant>(() => {
		const globalOrDefaultConfig = this._globalOrDefaultConfig;
		const localInputConfig = this.userVariant();

		// Priority 1: Local input object
		if (typeof localInputConfig === 'object' && localInputConfig !== null && Object.keys(localInputConfig).length > 0) {
			// Merge local input with the baseline provided by injectHlmTableConfig()
			// This ensures that properties not in localInputConfig still fall back to global/default values.
			return { ...globalOrDefaultConfig, ...localInputConfig };
		}
		// If localInputConfig is not a non-empty object (e.g., it's undefined, an empty object, or a string),
		// then the globalOrDefaultConfig (which is already the result of injected OR default) is used.
		return globalOrDefaultConfig;
	});

	constructor() {
		classes(() => this._variant().table);
	}
}

/**
 * Directive to apply Shadcn-like styling to a <thead> element
 * within an HlmTableDirective context.
 */
@Directive({
	selector: 'thead[hlmTHead],thead[hlmTableHeader]',
	host: { 'data-slot': 'table-header' },
})
export class HlmTHead {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();

	constructor() {
		classes(() => (this._globalOrDefaultConfig ? this._globalOrDefaultConfig.thead.trim() : ''));
	}
}

/**
 * Directive to apply Shadcn-like styling to a <tbody> element
 * within an HlmTableDirective context.
 */
@Directive({
	selector: 'tbody[hlmTBody],tbody[hlmTableBody]',
	host: { 'data-slot': 'table-body' },
})
export class HlmTBody {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();
	constructor() {
		classes(() => (this._globalOrDefaultConfig ? this._globalOrDefaultConfig.tbody.trim() : ''));
	}
}

/**
 * Directive to apply Shadcn-like styling to a <tfoot> element
 * within an HlmTableDirective context.
 */
@Directive({
	selector: 'tfoot[hlmTFoot],tfoot[hlmTableFooter]',
	host: { 'data-slot': 'table-footer' },
})
export class HlmTFoot {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();
	constructor() {
		classes(() => (this._globalOrDefaultConfig ? this._globalOrDefaultConfig.tfoot.trim() : ''));
	}
}

/**
 * Directive to apply Shadcn-like styling to a <tr> element
 * within an HlmTableDirective context.
 */
@Directive({
	selector: 'tr[hlmTr],tr[hlmTableRow]',
	host: { 'data-slot': 'table-row' },
})
export class HlmTr {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();
	constructor() {
		classes(() => (this._globalOrDefaultConfig ? this._globalOrDefaultConfig.tr.trim() : ''));
	}
}

/**
 * Directive to apply Shadcn-like styling to a <th> element
 * within an HlmTableDirective context.
 */
@Directive({
	selector: 'th[hlmTh],th[hlmTableHead]',
	host: { 'data-slot': 'table-head' },
})
export class HlmTh {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();
	constructor() {
		classes(() => (this._globalOrDefaultConfig ? this._globalOrDefaultConfig.th.trim() : ''));
	}
}

/**
 * Directive to apply Shadcn-like styling to a <td> element
 * within an HlmTableDirective context.
 */
@Directive({
	selector: 'td[hlmTd],td[hlmTableCell]',
	host: { 'data-slot': 'table-cell' },
})
export class HlmTd {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();
	constructor() {
		classes(() => (this._globalOrDefaultConfig ? this._globalOrDefaultConfig.td.trim() : ''));
	}
}

/**
 * Directive to apply Shadcn-like styling to a <caption> element
 * within an HlmTableDirective context.
 */
@Directive({
	selector: 'caption[hlmCaption],caption[hlmTableCaption]',
	host: { 'data-slot': 'table-caption' },
})
export class HlmCaption {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();
	constructor() {
		classes(() => (this._globalOrDefaultConfig ? this._globalOrDefaultConfig.caption.trim() : ''));
	}
}
