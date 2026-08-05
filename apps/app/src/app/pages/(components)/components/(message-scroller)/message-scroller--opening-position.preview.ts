import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { injectBrnMessageScroller } from '@spartan-ng/brain/message-scroller';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmMessageScrollerImports } from '@spartan-ng/helm/message-scroller';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { MessageScrollerTranscriptRow } from './message-scroller-transcript-row';
import { OPENING_POSITION_SCRIPT } from './message-scroller.shared';

@Component({
	selector: 'spartan-message-scroller-opening-position-scroller',
	imports: [HlmMessageScrollerImports, MessageScrollerTranscriptRow],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div hlmMessageScroller>
			<div hlmMessageScrollerViewport>
				<div hlmMessageScrollerContent class="p-(--card-spacing)">
					@for (message of _messages; track message.id) {
						<spartan-message-scroller-transcript-row
							[messageId]="message.id"
							[role]="message.role"
							[text]="message.text"
							[scrollAnchor]="message.role === 'user'"
							userVariant="muted"
							assistantVariant="ghost"
						/>
					}
				</div>
			</div>
			<button hlmMessageScrollerButton></button>
		</div>
	`,
})
export class MessageScrollerOpeningPositionScroller {
	private readonly _scroller = injectBrnMessageScroller();

	protected readonly _messages = OPENING_POSITION_SCRIPT;

	public readonly position = input.required<'start' | 'end' | 'last-anchor'>();
	public readonly positionKey = input.required<number>();

	constructor() {
		effect((onCleanup) => {
			const position = this.position();
			void this.positionKey();

			if (typeof window === 'undefined') {
				return;
			}

			const frame = requestAnimationFrame(() => {
				if (position === 'start') {
					this._scroller.scrollToStart({ behavior: 'auto' });
					return;
				}

				if (position === 'end') {
					this._scroller.scrollToEnd({ behavior: 'auto' });
					return;
				}

				this._scroller.scrollToMessage('open-3', {
					align: 'start',
					behavior: 'auto',
					scrollMargin: 64,
				});
			});

			onCleanup(() => cancelAnimationFrame(frame));
		});
	}
}

@Component({
	selector: 'spartan-message-scroller-opening-position-preview',
	imports: [HlmCardImports, HlmTabsImports, HlmMessageScrollerImports, MessageScrollerOpeningPositionScroller],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'relative flex w-full max-w-sm flex-col gap-4',
	},
	template: `
		<hlm-card class="mx-auto h-[35rem] w-full max-w-sm gap-0">
			<hlm-card-header class="gap-1 border-b">
				<h3 hlmCardTitle>Opening Position</h3>
				<p hlmCardDescription>Choose where a saved transcript opens.</p>
			</hlm-card-header>

			<div hlmCardContent class="flex-1 overflow-hidden p-0">
				<div hlmMessageScrollerProvider>
					<spartan-message-scroller-opening-position-scroller [position]="_position()" [positionKey]="_positionKey()" />
				</div>
			</div>

			<hlm-card-footer class="flex items-center justify-center border-t">
				<hlm-tabs [tab]="_position()" class="w-full" (tabActivated)="onPositionChange($event)">
					<hlm-tabs-list class="w-full">
						<button hlmTabsTrigger="start">start</button>
						<button hlmTabsTrigger="end">end</button>
						<button hlmTabsTrigger="last-anchor">last-anchor</button>
					</hlm-tabs-list>
				</hlm-tabs>
			</hlm-card-footer>
		</hlm-card>

		<div class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs">
			Toggle the defaultScrollPosition to see where the transcript starts when you open the thread
		</div>
	`,
})
export class MessageScrollerOpeningPositionPreview {
	protected readonly _position = signal<'start' | 'end' | 'last-anchor'>('last-anchor');
	protected readonly _positionKey = signal(0);

	protected onPositionChange(value: string): void {
		if (value === 'start' || value === 'end' || value === 'last-anchor') {
			this._position.set(value);
			this._positionKey.update((key) => key + 1);
		}
	}
}
