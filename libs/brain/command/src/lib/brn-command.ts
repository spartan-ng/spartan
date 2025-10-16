import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { isPlatformBrowser } from '@angular/common';
import {
	type AfterViewInit,
	computed,
	contentChild,
	contentChildren,
	Directive,
	effect,
	inject,
	Injector,
	input,
	output,
	PLATFORM_ID,
	untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrnCommandItemToken } from './brn-command-item.token';
import { BrnCommandSearchInput } from './brn-command-search-input';
import { type CommandFilter, injectBrnCommandConfig, provideBrnCommand } from './brn-command.token';

@Directive({
	selector: '[brnCommand]',
	providers: [provideBrnCommand(BrnCommand)],
	host: {
		'[id]': 'id()',
		'(keydown.enter)': 'selectActiveItem()',
	},
})
export class BrnCommand implements AfterViewInit {
	private static _id = 0;

	private readonly _platform = inject(PLATFORM_ID);

	private readonly _injector = inject(Injector);

	private readonly _config = injectBrnCommandConfig();

	/** The id of the command */
	public readonly id = input<string>(`brn-command-${++BrnCommand._id}`);

	/** A custom filter function to use when searching. */
	public readonly filter = input<CommandFilter>(this._config.filter);

	/** when the selection has changed */
	public readonly valueChange = output<string>();

	/** @internal The search query */
	public readonly search = computed(() => this._searchInput()?.valueState() ?? '');

	/** Access the search input if present */
	private readonly _searchInput = contentChild(BrnCommandSearchInput, {
		descendants: true,
	});

	/** @internal Access all the items within the command */
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
			.skipPredicate((item) => item.disabled || !item.visible());

		// When clearing the search input we also want to reset the active item to the first one
		effect(() => {
			const searchInput = this.search();
			untracked(() => {
				const activeItemIsVisible = this.keyManager.activeItem?.visible();
				if ((searchInput !== undefined && searchInput.length === 0) || !activeItemIsVisible) {
					this.keyManager.setFirstItemActive();
				}
			});
		});

		this.keyManager.change.pipe(takeUntilDestroyed()).subscribe(() => {
			const value = this.keyManager.activeItem?.safeValue();
			if (value) {
				this.valueChange.emit(value);
			}
		});
	}

	ngAfterViewInit(): void {
		if (isPlatformBrowser(this._platform) && this.items().length) {
			this.keyManager.setActiveItem(0);
		}
	}

	protected selectActiveItem(): void {
		this.keyManager.activeItem?.selected.emit();
	}
}
