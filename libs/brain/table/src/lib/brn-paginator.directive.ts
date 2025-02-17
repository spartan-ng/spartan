import {
	Directive,
	Input,
	type OnInit,
	type Signal,
	TemplateRef,
	ViewContainerRef,
	computed,
	effect,
	inject,
	numberAttribute,
	signal,
	untracked,
} from '@angular/core';

export type PaginatorState = {
	currentPage: number;
	startIndex: number;
	endIndex: number;
	pageSize: number;
	totalPages: number;
	totalElements: number | null | undefined;
};

export type PaginatorContext = {
	$implicit: {
		state: Signal<PaginatorState>;
		incrementable: Signal<boolean>;
		decrementable: Signal<boolean>;
		increment: () => void;
		decrement: () => void;
	};
};

@Directive({
	standalone: true,
	selector: '[brnPaginator]',
	exportAs: 'brnPaginator',
})
export class BrnPaginatorDirective implements OnInit {
	static ngTemplateContextGuard(_directive: BrnPaginatorDirective, _context: unknown): _context is PaginatorContext {
		return true;
	}

	private readonly _vcr = inject(ViewContainerRef);
	private readonly _template = inject(TemplateRef<unknown>);

	private readonly _state = signal<PaginatorState>({
		currentPage: 0,
		startIndex: 0,
		endIndex: 0,
		pageSize: 10,
		totalPages: 0,
		totalElements: null,
	});
	private readonly _decrementable = computed(() => 0 < this._state().startIndex);
	private readonly _incrementable = computed(() => this._state().endIndex < (this._state().totalElements ?? 0) - 1);

	@Input({ alias: 'brnPaginatorTotalElements' })
	public set totalElements(value: number | null | undefined) {
		this.calculateNewState({ newTotalElements: value, newPage: 0 });
	}

	@Input({ alias: 'brnPaginatorCurrentPage', transform: numberAttribute })
	public set currentPage(value: number) {
		this.calculateNewState({ newPage: value });
	}

	@Input({ alias: 'brnPaginatorPageSize', transform: numberAttribute })
	public set pageSize(value: number) {
		this.calculateNewState({ newPageSize: value, newPage: 0 });
	}

	@Input({ alias: 'brnPaginatorOnStateChange' })
	public onStateChange?: (state: PaginatorState) => void;

	constructor() {
		effect(() => {
			const state = this._state();
			untracked(() => {
				Promise.resolve().then(() => {
					if (this.onStateChange) {
						this.onStateChange(state);
					}
				});
			});
		});
	}

	public ngOnInit() {
		this._vcr.createEmbeddedView<PaginatorContext>(this._template, {
			$implicit: {
				state: this._state,
				increment: () => this.incrementPage(),
				decrement: () => this.decrementPage(),
				incrementable: this._incrementable,
				decrementable: this._decrementable,
			},
		});
	}

	public decrementPage(): void {
		const { currentPage } = this._state();
		if (0 < currentPage) {
			this.calculateNewState({ newPage: currentPage - 1 });
		}
	}

	public incrementPage(): void {
		const { currentPage, totalPages } = this._state();
		if (totalPages > currentPage) {
			this.calculateNewState({ newPage: currentPage + 1 });
		}
	}

	public reset(): void {
		this.currentPage = 0;
	}

	private calculateNewState({
		newPage,
		newPageSize,
		newTotalElements,
	}: Partial<{
		newPage: number;
		newPageSize: number;
		newTotalElements: number | null | undefined;
	}>) {
		const previousState = this._state();

		let currentPage = newPage ?? previousState.currentPage;
		const pageSize = newPageSize ?? previousState.pageSize;
		const totalElements = newTotalElements ?? previousState.totalElements ?? 0;

		const newTotalPages = totalElements ? Math.floor(totalElements / pageSize) : 0;

		if (newTotalPages < currentPage - 1) {
			currentPage = newTotalPages - 1;
		}

		const newStartIndex = totalElements === 0 ? 0 : Math.min(totalElements - 1, currentPage * pageSize);
		const newEndIndex = Math.min((currentPage + 1) * pageSize - 1, totalElements - 1);

		const newState = {
			currentPage: currentPage,
			startIndex: newStartIndex,
			endIndex: newEndIndex,
			pageSize: pageSize,
			totalPages: newTotalPages,
			totalElements: totalElements,
		};

		this._state.set(newState);
	}
}
