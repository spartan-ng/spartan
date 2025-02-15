import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { isPlatformBrowser } from '@angular/common';
import {
	AfterViewInit,
	computed,
	contentChild,
	contentChildren,
	Directive,
	effect,
	HostListener,
	inject,
	Injector,
	input,
	output,
	PLATFORM_ID,
	untracked,
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

	private readonly _platform = inject(PLATFORM_ID);

	private readonly _injector = inject(Injector);

	/** The id of the command */
	public readonly id = input<string>(`brn-command-${BrnCommandDirective._id++}`);

	/** The default filter function */
	private readonly _defaultFilter = (value: string, search: string) =>
		value.toLowerCase().includes(search.toLowerCase());

	/** A custom filter function to use when searching. */
	public readonly filter = input<CommandFilter>(this._defaultFilter);

	/** when the selection has changed */
	public readonly valueChange = output<string>();

	/** @internal The search query */
	public readonly search = computed(() => this._searchInput()?.valueState() ?? '');

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

	@HostListener('keydown.enter')
	protected selectActiveItem(): void {
		this.keyManager.activeItem?.selected.emit();
	}
}

export type CommandFilter = (value: string, search: string) => boolean;
