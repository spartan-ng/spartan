import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideMessageCircleDashed, lucideRotateCw } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmMessageScrollerImports } from '@spartan-ng/helm/message-scroller';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import { MessageScrollerTranscriptRow } from './message-scroller-transcript-row';
import { ANCHORING_SCRIPT, type DemoMessage } from './message-scroller.shared';

@Component({
	selector: 'spartan-message-scroller-anchoring-preview',
	imports: [
		HlmMessageScrollerImports,
		HlmCardImports,
		HlmButtonImports,
		HlmEmptyImports,
		HlmToggleGroupImports,
		MessageScrollerTranscriptRow,
		NgIcon,
	],
	providers: [provideIcons({ lucideArrowUp, lucideMessageCircleDashed, lucideRotateCw })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'relative flex w-full max-w-sm flex-col gap-4',
	},
	template: `
		<hlm-card class="mx-auto h-[35rem] w-full max-w-sm gap-0">
			<hlm-card-header class="border-b">
				<h3 hlmCardTitle>Anchoring Turns</h3>
				<p hlmCardDescription>Choose which role settles near the top edge.</p>
				<div hlmCardAction>
					<button
						hlmBtn
						type="button"
						variant="outline"
						size="icon"
						aria-label="Reset anchored turns"
						[disabled]="_messages().length === 0"
						(click)="reset()"
					>
						<ng-icon name="lucideRotateCw" />
					</button>
				</div>
			</hlm-card-header>

			<div hlmCardContent class="min-h-0 flex-1 overflow-hidden p-0">
				@if (_messages().length === 0) {
					<hlm-empty class="h-full">
						<hlm-empty-header>
							<hlm-empty-media variant="icon">
								<ng-icon name="lucideMessageCircleDashed" />
							</hlm-empty-media>
							<div hlmEmptyTitle>No anchored messages yet</div>
							<div hlmEmptyDescription>Send the first message to see the selected role anchor.</div>
						</hlm-empty-header>
					</hlm-empty>
				} @else {
					<div hlmMessageScrollerProvider>
						<div hlmMessageScroller>
							<div hlmMessageScrollerViewport>
								<div hlmMessageScrollerContent class="p-(--card-spacing)">
									@for (message of _messages(); track message.id) {
										<spartan-message-scroller-transcript-row
											[messageId]="message.id"
											[role]="message.role"
											[text]="message.text"
											[scrollAnchor]="message.role === _anchorRole()"
											userVariant="muted"
											assistantVariant="ghost"
											[animationClass]="
												message.role === 'user'
													? 'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 duration-300'
													: ''
											"
										/>
									}
								</div>
							</div>
							<button hlmMessageScrollerButton></button>
						</div>
					</div>
				}
			</div>

			<hlm-card-footer>
				<hlm-toggle-group
					type="single"
					[spacing]="2"
					[value]="_anchorRole()"
					(valueChange)="onAnchorRoleChange($event)"
					aria-label="Select scroll anchor role"
				>
					<button hlmToggleGroupItem value="user" aria-label="Anchor user messages">User</button>
					<button hlmToggleGroupItem value="assistant" aria-label="Anchor assistant messages">Assistant</button>
				</hlm-toggle-group>
				<button hlmBtn type="button" size="icon" class="ms-auto" [disabled]="!_nextMessage()" (click)="sendNext()">
					<ng-icon name="lucideArrowUp" />
					<span class="sr-only">Send Message</span>
				</button>
			</hlm-card-footer>
		</hlm-card>

		<div class="text-muted-foreground mx-auto max-w-xs px-0.5 text-center text-xs">
			Toggle the anchor role, then send messages to compare where turns settle.
		</div>
	`,
})
export class MessageScrollerAnchoringPreview {
	protected readonly _anchorRole = signal<'user' | 'assistant'>('user');
	protected readonly _messages = signal<DemoMessage[]>([]);
	protected readonly _messageIndex = signal(0);

	protected readonly _nextMessage = () => ANCHORING_SCRIPT[this._messageIndex()] ?? null;

	protected onAnchorRoleChange(value: 'user' | 'assistant' | ('user' | 'assistant')[] | null | undefined): void {
		const next = Array.isArray(value) ? value[0] : value;

		if (next === 'user' || next === 'assistant') {
			this._anchorRole.set(next);
			this.reset();
		}
	}

	protected reset(): void {
		this._messages.set([]);
		this._messageIndex.set(0);
	}

	protected sendNext(): void {
		const next = this._nextMessage();

		if (!next) {
			return;
		}

		this._messages.update((messages) => [...messages, next]);
		this._messageIndex.update((index) => index + 1);
	}
}
