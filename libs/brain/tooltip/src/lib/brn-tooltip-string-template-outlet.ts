import {
	Directive,
	effect,
	type EffectRef,
	type EmbeddedViewRef,
	inject,
	input,
	type OnDestroy,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';

export function isTemplateRef<C = unknown>(value: unknown): value is TemplateRef<C> {
	return value instanceof TemplateRef;
}

export interface BrnTemplateOutletContext {
	$implicit: unknown;
	[key: string]: unknown;
}

@Directive({
	selector: '[brnTooltipStringTemplateOutlet]',
	exportAs: 'brnTooltipStringTemplateOutlet',
})
export class BrnTooltipStringTemplateOutlet<T = unknown> implements OnDestroy {
	private readonly _viewContainer = inject(ViewContainerRef);
	private readonly _templateRef = inject(TemplateRef<void>);

	private _embeddedViewRef: EmbeddedViewRef<BrnTemplateOutletContext> | null = null;
	private readonly _context = {} as BrnTemplateOutletContext;

	private _isFirstChange = true;
	private _lastOutletWasTemplate = false;
	private _lastTemplateRef: TemplateRef<void> | null = null;
	private _lastContext?: BrnTemplateOutletContext;

	public readonly brnTooltipStringTemplateOutletContext = input<BrnTemplateOutletContext | undefined>(undefined);
	public readonly brnTooltipStringTemplateOutlet = input.required<T | TemplateRef<void>>();

	_hasContextShapeChanged(context: BrnTemplateOutletContext | undefined): boolean {
		if (!context) {
			return false;
		}
		const prevCtxKeys = Object.keys(this._lastContext || {});
		const currCtxKeys = Object.keys(context || {});

		if (prevCtxKeys.length === currCtxKeys.length) {
			for (const propName of currCtxKeys) {
				if (!prevCtxKeys.includes(propName)) {
					return true;
				}
			}
			return false;
		} else {
			return true;
		}
	}

	_shouldViewBeRecreated(
		stringTemplateOutlet: TemplateRef<void> | T,
		stringTemplateOutletContext: BrnTemplateOutletContext | undefined,
	): boolean {
		const isTemplate = isTemplateRef(stringTemplateOutlet);

		const shouldOutletRecreate =
			this._isFirstChange ||
			isTemplate !== this._lastOutletWasTemplate ||
			(isTemplate && stringTemplateOutlet !== this._lastTemplateRef);

		const shouldContextRecreate = this._hasContextShapeChanged(stringTemplateOutletContext);
		return shouldContextRecreate || shouldOutletRecreate;
	}

	_updateTrackingState(
		stringTemplateOutlet: TemplateRef<void> | T,
		stringTemplateOutletContext: BrnTemplateOutletContext | undefined,
	): void {
		const isTemplate = isTemplateRef(stringTemplateOutlet);
		if (this._isFirstChange && !isTemplate) {
			this._isFirstChange = false;
		}

		if (stringTemplateOutletContext !== undefined) {
			this._lastContext = stringTemplateOutletContext;
		}

		this._lastOutletWasTemplate = isTemplate;
		this._lastTemplateRef = isTemplate ? stringTemplateOutlet : null;
	}

	private readonly _viewEffect: EffectRef = effect(() => {
		const stringTemplateOutlet = this.brnTooltipStringTemplateOutlet();
		const stringTemplateOutletContext = this.brnTooltipStringTemplateOutletContext();

		if (!this._isFirstChange && isTemplateRef(stringTemplateOutlet)) {
			this._isFirstChange = true;
		}

		if (!isTemplateRef(stringTemplateOutlet)) {
			this._context['$implicit'] = stringTemplateOutlet as T;
		}

		const recreateView = this._shouldViewBeRecreated(stringTemplateOutlet, stringTemplateOutletContext);
		this._updateTrackingState(stringTemplateOutlet, stringTemplateOutletContext);

		if (recreateView) {
			this._recreateView(stringTemplateOutlet as TemplateRef<BrnTemplateOutletContext>, stringTemplateOutletContext);
		} else {
			this._updateContext(stringTemplateOutlet, stringTemplateOutletContext);
		}
	});

	private _recreateView(
		outlet: TemplateRef<BrnTemplateOutletContext>,
		context: BrnTemplateOutletContext | undefined,
	): void {
		this._viewContainer.clear();
		if (isTemplateRef(outlet)) {
			this._embeddedViewRef = this._viewContainer.createEmbeddedView(outlet, context);
		} else {
			this._embeddedViewRef = this._viewContainer.createEmbeddedView(this._templateRef, this._context);
		}
	}

	private _updateContext(outlet: TemplateRef<void> | T, context: BrnTemplateOutletContext | undefined): void {
		const newCtx = isTemplateRef(outlet) ? context : this._context;
		let oldCtx = this._embeddedViewRef?.context;

		if (!oldCtx) {
			oldCtx = newCtx;
		} else if (newCtx && typeof newCtx === 'object') {
			for (const propName of Object.keys(newCtx)) {
				oldCtx[propName] = newCtx[propName];
			}
		}
		this._lastContext = oldCtx;
	}

	static ngTemplateContextGuard<T>(
		_dir: BrnTooltipStringTemplateOutlet<T>,
		_ctx: unknown,
	): _ctx is BrnTemplateOutletContext {
		return true;
	}

	public ngOnDestroy(): void {
		this._viewEffect.destroy();
		this._viewContainer.clear();
		this._embeddedViewRef = null;
	}
}
