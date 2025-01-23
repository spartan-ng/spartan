import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import {
	AfterViewInit,
	computed,
	contentChild,
	contentChildren,
	Directive,
	inject,
	Injector,
	input,
	model,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrnCommandItemToken } from './brn-command-item.token';
import { BrnCommandSearchInputDirective } from './brn-command-search-input.directive';
import { provideBrnCommand } from './brn-command.token';

@Directive({
	selector: '[brnCommand]',
	standalone: true,
	providers: [provideBrnCommand(BrnCommandDirective)],
	host: {
		'[id]': 'id()',
	},
})
export class BrnCommandDirective implements AfterViewInit {
	private static _id = 0;

	private readonly _injector = inject(Injector);

	/** The id of the command */
	public readonly id = input<string>(`brn-command-${BrnCommandDirective._id++}`);

	/*** The currently selected value. */
	public readonly value = model<string>();

	/** The default filter function */
	private readonly _defaultFilter = (value: string, search: string) =>
		value.toLowerCase().includes(search.toLowerCase());

	/** A custom filter function to use when searching. */
	public readonly filter = input<CommandFilter>(this._defaultFilter);

	/** @internal The search query */
	public readonly search = computed(() => this._searchInput()?.value() ?? '');

	/** Access the search input if present */
	private readonly _searchInput = contentChild(BrnCommandSearchInputDirective, {
		descendants: true,
	});

	/** @internal Access all the items within the commmand */
	public readonly items = contentChildren(BrnCommandItemToken, {
		descendants: true,
	});

	/** @internal The key manager for managing active descendant */
	public readonly keyManager = new ActiveDescendantKeyManager(this.items, this._injector);

	constructor() {
		this.keyManager
			.withVerticalOrientation()
			.withHomeAndEnd()
			.withWrap()
			.withTypeAhead()
			.skipPredicate((item) => item.disabled || !item.visible());

		// any time the active item changes, emit the new value
		this.keyManager.change
			.pipe(takeUntilDestroyed())
			.subscribe((index) => this.value.set(this.items()[index]?.value()));
	}

	ngAfterViewInit(): void {
		if (this.items().length) {
			this.keyManager.setActiveItem(0);
		}
	}
}

export type CommandFilter = (value: string, search: string) => boolean;
