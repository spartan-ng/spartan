import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRotateCw } from '@ng-icons/lucide';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmMarkerImports } from '@spartan-ng/helm/marker';
import { HlmMessageImports } from '@spartan-ng/helm/message';
import { HlmMessageScrollerImports } from '@spartan-ng/helm/message-scroller';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

type GroupChatItem =
	| {
			id: string;
			type: 'event';
			text: string;
			scrollAnchor?: boolean;
	  }
	| {
			id: string;
			type: 'message';
			sender: string;
			role: 'assistant' | 'participant';
			text: string;
			scrollAnchor?: boolean;
	  };

const currentUser = 'Grace';

const initialItems: GroupChatItem[] = [
	{
		id: 'group-1',
		type: 'message',
		sender: 'Grace',
		role: 'participant',
		text: '@mary, the astrophage line keeps matching Venus energy output. Can you check my math?',
	},
	{
		id: 'group-2',
		type: 'message',
		sender: 'Mary (Agent)',
		role: 'assistant',
		text: 'Yes. Confirmed. The curve points to a microorganism harvesting stellar energy and breeding near carbon dioxide. If @rocky agrees, this is the clue we need.',
	},
	{
		id: 'group-3',
		type: 'message',
		sender: 'Grace',
		role: 'participant',
		text: 'ping @rocky',
		scrollAnchor: true,
	},
];

const rockyMarker: GroupChatItem = {
	id: 'group-4',
	type: 'event',
	text: 'Rocky has joined the chat',
	scrollAnchor: true,
};

const rockyMessage: GroupChatItem = {
	id: 'group-5',
	type: 'message',
	sender: 'Rocky',
	role: 'participant',
	text: 'Amaze. Astrophage eats light, makes heat, goes to carbon dioxide. Rocky has fuel model. Grace is smart.',
};

@Component({
	selector: 'spartan-message-scroller-group-chat-preview',
	imports: [
		HlmMessageScrollerImports,
		HlmCardImports,
		HlmButtonImports,
		HlmMessageImports,
		HlmBubbleImports,
		HlmMarkerImports,
		HlmTooltipImports,
		NgIcon,
	],
	providers: [provideIcons({ lucideRotateCw })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'relative flex w-full max-w-sm flex-col gap-4',
	},
	template: `
		<div hlmMessageScrollerProvider>
			<div class="relative flex flex-col gap-4">
				<hlm-card class="mx-auto h-[35rem] w-full max-w-sm gap-0">
					<hlm-card-header class="gap-1 border-b">
						<h3 hlmCardTitle>Group Chat</h3>
						<p hlmCardDescription>
							A group chat with several participants and an assistant. The Marker is marked as a turn.
						</p>
						<div hlmCardAction>
							<button
								hlmBtn
								type="button"
								variant="outline"
								size="icon"
								hlmTooltip="Reset"
								aria-label="Reset conversation"
								[disabled]="_rockyTurn() === 'idle'"
								(click)="reset()"
							>
								<ng-icon name="lucideRotateCw" />
							</button>
						</div>
					</hlm-card-header>

					<div hlmCardContent class="min-h-0 flex-1 overflow-hidden p-0">
						@for (key of [_demoKey()]; track key) {
							<div hlmMessageScroller>
								<div hlmMessageScrollerViewport>
									<div hlmMessageScrollerContent class="p-(--card-spacing)">
										@for (item of _items(); track item.id) {
											@if (item.type === 'message') {
												<div hlmMessageScrollerItem [messageId]="item.id" [scrollAnchor]="item.scrollAnchor ?? false">
													<div hlmMessage [align]="item.sender === _currentUser ? 'end' : 'start'">
														<div hlmMessageContent>
															@if (item.sender !== _currentUser) {
																<div hlmMessageHeader>{{ item.sender }}</div>
															}
															<div
																hlmBubble
																[variant]="
																	item.sender === _currentUser
																		? 'muted'
																		: item.role === 'assistant'
																			? 'ghost'
																			: 'tinted'
																"
															>
																<div hlmBubbleContent>{{ item.text }}</div>
															</div>
														</div>
													</div>
												</div>
											} @else {
												<div hlmMessageScrollerItem [messageId]="item.id" [scrollAnchor]="item.scrollAnchor ?? false">
													<div hlmMarker variant="separator">
														<span hlmMarkerContent>{{ item.text }}</span>
													</div>
												</div>
											}
										}
									</div>
								</div>
								<button hlmMessageScrollerButton></button>
							</div>
						}
					</div>

					<hlm-card-footer class="flex flex-col items-center gap-2 border-t">
						<button
							hlmBtn
							type="button"
							class="w-full"
							variant="secondary"
							[disabled]="_isComplete()"
							(click)="advanceRocky()"
						>
							{{ _buttonLabel() }}
						</button>
						<p class="text-muted-foreground text-xs">
							@if (_rockyTurn() === 'idle') {
								This will create a marker and make it the anchor
							} @else {
								Now send Rocky's reply into the conversation
							}
						</p>
					</hlm-card-footer>
				</hlm-card>

				<div class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs text-balance">
					When a user joins, a marker is created. scrollAnchor on the marker marks it as the next turn
				</div>
			</div>
		</div>
	`,
})
export class MessageScrollerGroupChatPreview {
	protected readonly _currentUser = currentUser;

	protected readonly _rockyTurn = signal<'idle' | 'marker' | 'message'>('idle');
	protected readonly _demoKey = signal(0);

	protected readonly _items = computed(() => {
		const rockyTurn = this._rockyTurn();

		if (rockyTurn === 'message') {
			return [...initialItems, rockyMarker, rockyMessage];
		}

		if (rockyTurn === 'marker') {
			return [...initialItems, rockyMarker];
		}

		return initialItems;
	});

	protected readonly _buttonLabel = computed(() =>
		this._rockyTurn() === 'idle' ? 'Add Rocky' : 'Send Message as Rocky',
	);

	protected readonly _isComplete = computed(() => this._rockyTurn() === 'message');

	protected reset(): void {
		this._rockyTurn.set('idle');
		this._demoKey.update((key) => key + 1);
	}

	protected advanceRocky(): void {
		this._rockyTurn.update((turn) => (turn === 'idle' ? 'marker' : 'message'));
	}
}
