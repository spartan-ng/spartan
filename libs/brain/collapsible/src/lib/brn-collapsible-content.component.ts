import { isPlatformServer } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	OnInit,
	PLATFORM_ID,
	effect,
	inject,
	input,
	signal,
	untracked,
} from '@angular/core';
import { BrnCollapsibleComponent } from './brn-collapsible.component';

@Component({
	selector: 'brn-collapsible-content',
	host: {
		'[hidden]': '!collapsible?.expanded()',
		'[attr.data-state]': 'collapsible?.expanded() ? "open" : "closed"',
		'[id]': 'collapsible?.contentId()',
		'[style.--brn-collapsible-content-width.px]': 'width()',
		'[style.--brn-collapsible-content-height.px]': 'height()',
	},
	template: `
		<ng-content />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrnCollapsibleContentComponent implements OnInit {
	protected readonly collapsible = inject(BrnCollapsibleComponent, { optional: true });
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _platformId = inject(PLATFORM_ID);
	/**
	 * The id of the collapsible content element.
	 */
	public readonly id = input<string | null | undefined>();
	protected readonly width = signal<number | null>(null);
	protected readonly height = signal<number | null>(null);

	constructor() {
		if (!this.collapsible) {
			throw Error('Collapsible trigger directive can only be used inside a brn-collapsible element.');
		}

		effect(() => {
			const id = this.id();
			const collapsible = this.collapsible;
			if (!id || !collapsible) return;
			untracked(() => collapsible.contentId.set(id));
		});
	}

	ngOnInit(): void {
		if (isPlatformServer(this._platformId)) {
			return;
		}

		// ensure the element is not hidden when measuring its size
		this._elementRef.nativeElement.hidden = false;

		const { width, height } = this._elementRef.nativeElement.getBoundingClientRect();
		this.width.set(width);
		this.height.set(height);

		// we force the element to be hidden again if collapsed after measuring its size
		// this is handled by the host binding, but it can cause a flicker if we don't do this here manually
		this._elementRef.nativeElement.hidden = this.collapsible?.expanded() ?? false;
	}
}
