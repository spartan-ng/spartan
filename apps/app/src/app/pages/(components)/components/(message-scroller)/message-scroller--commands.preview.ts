import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectBrnMessageScroller } from '@spartan-ng/brain/message-scroller';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmMessageScrollerImports } from '@spartan-ng/helm/message-scroller';
import { MessageScrollerTranscriptRow } from './message-scroller-transcript-row';
import { COMMANDS_SCRIPT, trimMessageText } from './message-scroller.shared';

@Component({
	selector: 'spartan-message-scroller-commands-menu',
	imports: [HlmButtonImports, HlmDropdownMenuImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button hlmBtn type="button" variant="secondary" [hlmDropdownMenuTrigger]="menu" align="end" side="bottom">
			Jump to...
		</button>

		<ng-template #menu>
			<hlm-dropdown-menu class="w-64">
				<div hlmDropdownMenuGroup>
					<div hlmDropdownMenuLabel>Conversations</div>
					@for (message of _userMessages(); track message.id) {
						<button hlmDropdownMenuItem (click)="jumpTo(message.id)">
							<span class="line-clamp-1 min-w-0">{{ _trimMessageText(message.text) }}</span>
						</button>
					}
				</div>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class MessageScrollerCommandsMenu {
	private readonly _scroller = injectBrnMessageScroller();

	protected readonly _userMessages = computed(() => COMMANDS_SCRIPT.filter((message) => message.role === 'user'));

	protected readonly _trimMessageText = trimMessageText;

	protected jumpTo(messageId: string): void {
		this._scroller.scrollToMessage(messageId, {
			align: 'start',
			behavior: 'smooth',
		});
	}
}

@Component({
	selector: 'spartan-message-scroller-commands-preview',
	imports: [HlmMessageScrollerImports, HlmCardImports, MessageScrollerTranscriptRow, MessageScrollerCommandsMenu],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'relative flex w-full max-w-sm flex-col gap-4',
	},
	template: `
		<div hlmMessageScrollerProvider defaultScrollPosition="end">
			<div class="relative flex flex-col gap-4">
				<hlm-card class="mx-auto h-[35rem] w-full max-w-sm gap-0">
					<hlm-card-header class="gap-1 border-b">
						<h3 hlmCardTitle>Commands</h3>
						<p hlmCardDescription>Drive the transcript from outside.</p>
						<div hlmCardAction>
							<spartan-message-scroller-commands-menu />
						</div>
					</hlm-card-header>

					<div hlmCardContent class="flex-1 overflow-hidden p-0">
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
			</div>
		</div>

		<div class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs text-balance">
			Use the controls to jump to any message in the conversation.
		</div>
	`,
})
export class MessageScrollerCommandsPreview {
	protected readonly _messages = COMMANDS_SCRIPT;
}
