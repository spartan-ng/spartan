import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject } from '@angular/core';
import { injectBrnMessageScroller } from '@spartan-ng/brain/message-scroller';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmHoverCardImports } from '@spartan-ng/helm/hover-card';
import { HlmMessageScrollerImports } from '@spartan-ng/helm/message-scroller';
import { MessageScrollerTranscriptRow } from './message-scroller-transcript-row';
import { VISIBILITY_SCRIPT, trimMessageText } from './message-scroller.shared';

@Component({
	selector: 'spartan-message-scroller-transcript-outline',
	imports: [HlmHoverCardImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-hover-card>
			<button
				type="button"
				hlmHoverCardTrigger
				align="left"
				[sideOffset]="-28"
				aria-label="Open transcript outline"
				class="focus-visible:ring-ring/50 flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-md transition-colors outline-none focus-visible:ring-3"
			>
				@for (message of _userMessages(); track message.id) {
					<span
						class="bg-muted-foreground/40 data-[current=true]:bg-foreground h-0.5 w-4 rounded-full"
						[attr.data-current]="message.id === _currentAnchorId()"
					></span>
				}
			</button>
			<hlm-hover-card-content *hlmHoverCardPortal class="flex w-64 flex-col gap-1 rounded-2xl p-1">
				@for (message of _userMessages(); track message.id) {
					<button
						type="button"
						class="hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground aria-[current=location]:bg-accent aria-[current=location]:text-accent-foreground flex min-h-7 items-center rounded-xl px-2 py-1.5 text-left text-sm transition-colors outline-none"
						[attr.aria-current]="message.id === _currentAnchorId() ? 'location' : null"
						(click)="jumpTo(message.id)"
					>
						<span class="line-clamp-1 min-w-0">{{ _trimMessageText(message.text) }}</span>
					</button>
				}
			</hlm-hover-card-content>
		</hlm-hover-card>
	`,
})
export class MessageScrollerTranscriptOutline {
	private readonly _scroller = injectBrnMessageScroller();
	private readonly _destroyRef = inject(DestroyRef);

	protected readonly _userMessages = computed(() => VISIBILITY_SCRIPT.filter((message) => message.role === 'user'));
	protected readonly _currentAnchorId = computed(() => this._scroller.visibility().currentAnchorId);
	protected readonly _trimMessageText = trimMessageText;

	constructor() {
		this._scroller.observeVisibility();
		this._destroyRef.onDestroy(() => this._scroller.unobserveVisibility());
	}

	protected jumpTo(messageId: string): void {
		this._scroller.scrollToMessage(messageId, {
			align: 'start',
			behavior: 'smooth',
		});
	}
}

@Component({
	selector: 'spartan-message-scroller-visibility-preview',
	imports: [HlmMessageScrollerImports, HlmCardImports, MessageScrollerTranscriptRow, MessageScrollerTranscriptOutline],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'relative flex w-full flex-col gap-4 pe-12',
	},
	template: `
		<div hlmMessageScrollerProvider [scrollMargin]="12">
			<div class="relative mx-auto w-full max-w-sm">
				<hlm-card class="h-[35rem] w-full gap-0">
					<hlm-card-header class="gap-1 border-b">
						<h3 hlmCardTitle>Transcript Outline</h3>
						<p hlmCardDescription>Track the current anchored turn.</p>
					</hlm-card-header>

					<div hlmCardContent class="min-h-0 flex-1 overflow-hidden p-0">
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
					</div>
				</hlm-card>

				<div class="absolute -end-12 top-1/2 -translate-y-1/2">
					<spartan-message-scroller-transcript-outline />
				</div>
			</div>
		</div>

		<div class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs">
			Open the outline to jump between anchored turns as you read.
		</div>
	`,
})
export class MessageScrollerVisibilityPreview {
	protected readonly _messages = VISIBILITY_SCRIPT;
}
