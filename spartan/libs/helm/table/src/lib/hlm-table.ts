// src/app/directives/hlm-table-directives.ts
import { computed, Directive, inject, InjectionToken, input, type ValueProvider } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

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
	tableContainer: 'relative w-full overflow-x-auto',
	table: 'w-full caption-bottom text-sm',
	thead: '[&_tr]:border-b',
	tbody: '[&_tr:last-child]:border-0',
	tfoot: 'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
	tr: 'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
	th: 'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0',
	td: 'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0',
	caption: 'text-muted-foreground mt-4 text-sm',
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
	host: {
		'[class]': '_computedClass()',
		'data-slot': 'table-container',
	},
})
export class HlmTableContainer {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(this._globalOrDefaultConfig ? this._globalOrDefaultConfig.tableContainer.trim() : '', this.userClass()),
	);
}

/**
 * Directive to apply Shadcn-like styling to a <table> element.
 * It resolves and provides base classes for its child table elements.
 * If a table has the `hlmTable` attribute, it will be styled with the provided variant.
 * The other table elements will check if a parent table has the `hlmTable` attribute and will be styled accordingly.
 */
@Directive({
	selector: 'table[hlmTable]',
	host: {
		'[class]': '_computedClass()',
		'data-slot': 'table',
	},
})
export class HlmTable {
	/** Input to configure the variant of the table, this input has the highest priority. */
	public readonly userVariant = input<Partial<HlmTableVariant> | string>({}, { alias: 'hlmTable' });
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

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

	// Computed class for the host <table> element
	protected readonly _computedClass = computed(() => hlm(this._variant().table, this.userClass()));
}

/**
 * Directive to apply Shadcn-like styling to a <thead> element
 * within an HlmTableDirective context.
 */
@Directive({
	selector: 'thead[hlmTHead]',
	host: {
		'[class]': '_computedClass()',
		'data-slot': 'table-header',
	},
})
export class HlmTHead {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(this._globalOrDefaultConfig ? this._globalOrDefaultConfig.thead.trim() : '', this.userClass()),
	);
}

/**
 * Directive to apply Shadcn-like styling to a <tbody> element
 * within an HlmTableDirective context.
 */
@Directive({
	selector: 'tbody[hlmTBody]',
	host: {
		'[class]': '_computedClass()',
		'data-slot': 'table-body',
	},
})
export class HlmTBody {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(this._globalOrDefaultConfig ? this._globalOrDefaultConfig.tbody.trim() : '', this.userClass()),
	);
}

/**
 * Directive to apply Shadcn-like styling to a <tfoot> element
 * within an HlmTableDirective context.
 */
@Directive({
	selector: 'tfoot[hlmTFoot]',
	host: {
		'[class]': '_computedClass()',
		'data-slot': 'table-footer',
	},
})
export class HlmTFoot {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(this._globalOrDefaultConfig ? this._globalOrDefaultConfig.tfoot.trim() : '', this.userClass()),
	);
}

/**
 * Directive to apply Shadcn-like styling to a <tr> element
 * within an HlmTableDirective context.
 */
@Directive({
	selector: 'tr[hlmTr]',
	host: {
		'[class]': '_computedClass()',
		'data-slot': 'table-row',
	},
})
export class HlmTr {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(this._globalOrDefaultConfig ? this._globalOrDefaultConfig.tr.trim() : '', this.userClass()),
	);
}

/**
 * Directive to apply Shadcn-like styling to a <th> element
 * within an HlmTableDirective context.
 */
@Directive({
	selector: 'th[hlmTh]',
	host: {
		'[class]': '_computedClass()',
		'data-slot': 'table-head',
	},
})
export class HlmTh {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(this._globalOrDefaultConfig ? this._globalOrDefaultConfig.th.trim() : '', this.userClass()),
	);
}

/**
 * Directive to apply Shadcn-like styling to a <td> element
 * within an HlmTableDirective context.
 */
@Directive({
	selector: 'td[hlmTd]',
	host: {
		'[class]': '_computedClass()',
		'data-slot': 'table-cell',
	},
})
export class HlmTd {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(this._globalOrDefaultConfig ? this._globalOrDefaultConfig.td.trim() : '', this.userClass()),
	);
}

/**
 * Directive to apply Shadcn-like styling to a <caption> element
 * within an HlmTableDirective context.
 */
@Directive({
	selector: 'caption[hlmCaption]',
	host: {
		'[class]': '_computedClass()',
		'data-slot': 'table-caption',
	},
})
export class HlmCaption {
	private readonly _globalOrDefaultConfig = injectHlmTableConfig();
	public readonly userClass = input<ClassValue>('', { alias: 'class' });

	protected readonly _computedClass = computed(() =>
		hlm(this._globalOrDefaultConfig ? this._globalOrDefaultConfig.caption.trim() : '', this.userClass()),
	);
}
