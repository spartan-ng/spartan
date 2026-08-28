import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideArrowUp,
	lucideGlobe,
	lucideImage,
	lucideMessageCircleDashed,
	lucidePaperclip,
	lucidePlus,
	lucideRotateCw,
	lucideTelescope,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmMessageScrollerImports } from '@spartan-ng/helm/message-scroller';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { MessageScrollerTranscriptRow } from './message-scroller-transcript-row';
import { MAIN_CHAT_SCRIPT, ScriptedChatRunner } from './message-scroller.shared';

@Component({
	selector: 'spartan-message-scroller-preview',
	imports: [
		HlmMessageScrollerImports,
		HlmCardImports,
		HlmButtonImports,
		HlmEmptyImports,
		HlmInputGroupImports,
		HlmDropdownMenuImports,
		HlmTooltipImports,
		MessageScrollerTranscriptRow,
		NgIcon,
	],
	providers: [
		provideIcons({
			lucideArrowUp,
			lucideGlobe,
			lucideImage,
			lucideMessageCircleDashed,
			lucidePaperclip,
			lucidePlus,
			lucideRotateCw,
			lucideTelescope,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'relative flex w-full max-w-sm flex-col gap-4',
	},
	template: `
		<div hlmMessageScrollerProvider>
			<div class="relative flex flex-col gap-4">
				<hlm-card class="mx-auto h-[35rem] w-full max-w-sm gap-0">
					<hlm-card-header class="gap-1 border-b">
						<h3 hlmCardTitle>New Chat</h3>
						<p hlmCardDescription>How can I help you today?</p>
						<div hlmCardAction>
							<button
								hlmBtn
								type="button"
								variant="outline"
								size="icon"
								hlmTooltip="Reset"
								aria-label="Reset conversation"
								[disabled]="_chat.isBusy()"
								(click)="reset()"
							>
								<ng-icon name="lucideRotateCw" />
							</button>
						</div>
					</hlm-card-header>

					<div hlmCardContent class="min-h-0 flex-1 overflow-hidden p-0">
						@if (_chat.messages().length === 0) {
							<hlm-empty class="h-full">
								<hlm-empty-header>
									<hlm-empty-media variant="icon">
										<ng-icon name="lucideMessageCircleDashed" />
									</hlm-empty-media>
									<div hlmEmptyTitle>Morning, shadcn!</div>
									<div hlmEmptyDescription>What are we working on today? Press send to start a new conversation</div>
								</hlm-empty-header>
							</hlm-empty>
						} @else {
							<div hlmMessageScroller>
								<div hlmMessageScrollerViewport>
									<div
										hlmMessageScrollerContent
										class="p-(--card-spacing)"
										[attr.aria-busy]="_chat.isBusy() ? 'true' : null"
									>
										@for (message of _chat.messages(); track message.id) {
											<spartan-message-scroller-transcript-row
												[messageId]="message.id"
												[role]="message.role"
												[text]="message.text"
												[scrollAnchor]="message.role === 'user'"
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
						}
					</div>

					<hlm-card-footer class="flex-col gap-2">
						<form class="w-full" (submit)="send($event)">
							<hlm-input-group>
								<div class="h-14 w-full px-3 py-2.5">
									<span
										class="line-clamp-2 opacity-60 data-[status=ready]:opacity-100"
										[attr.data-status]="_chat.status()"
									>
										@if (_nextPreview(); as preview) {
											{{ preview }}
										} @else {
											<span class="text-muted-foreground">No messages queued. Reset the conversation.</span>
										}
									</span>
								</div>
								<hlm-input-group-addon align="block-end" class="pt-1">
									<button
										hlmInputGroupButton
										type="button"
										size="icon-sm"
										variant="outline"
										aria-label="Add files"
										[hlmDropdownMenuTrigger]="attachmentMenu"
										align="start"
										side="top"
									>
										<ng-icon name="lucidePlus" />
									</button>
									<button
										hlmInputGroupButton
										type="submit"
										variant="default"
										size="icon-sm"
										class="ms-auto"
										[disabled]="!_chat.nextMessage() || _chat.isBusy()"
									>
										<ng-icon name="lucideArrowUp" />
										<span class="sr-only">Send</span>
									</button>
								</hlm-input-group-addon>
							</hlm-input-group>
						</form>
					</hlm-card-footer>
				</hlm-card>

				<div class="text-muted-foreground px-0.5 text-center text-xs">
					Demo is read only. Press send to send messages.
				</div>
			</div>
		</div>

		<ng-template #attachmentMenu>
			<hlm-dropdown-menu class="w-44">
				<button hlmDropdownMenuItem>
					<ng-icon name="lucidePaperclip" />
					Add Photos &amp; Files
				</button>
				<div hlmDropdownMenuSeparator></div>
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideImage" />
					Create Image
				</button>
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideTelescope" />
					Deep Research
				</button>
				<button hlmDropdownMenuItem>
					<ng-icon name="lucideGlobe" />
					Web Search
				</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
export class MessageScrollerPreview {
	protected readonly _chat = new ScriptedChatRunner(MAIN_CHAT_SCRIPT, {
		streamDelayMs: 20,
		thinkDelayMs: 1000,
	});

	protected readonly _nextPreview = computed(() => this._chat.nextMessage()?.text ?? null);

	protected reset(): void {
		this._chat.reset();
	}

	protected send(event: Event): void {
		event.preventDefault();
		if (!this._chat.nextMessage() || this._chat.isBusy()) {
			return;
		}
		void this._chat.sendNext();
	}
}

export const defaultImports = `
import { HlmMessageScrollerImports } from '@spartan-ng/helm/message-scroller';
`;

export const defaultSkeleton = `
<div hlmMessageScrollerProvider [autoScroll]="true">
  <div hlmMessageScroller class="h-96">
    <div hlmMessageScrollerViewport>
      <div hlmMessageScrollerContent>
        @for (message of messages; track message.id) {
          <div
            hlmMessageScrollerItem
            [messageId]="message.id"
            [scrollAnchor]="message.role === 'user'"
          >
            <!-- Message / Marker / etc. -->
          </div>
        }
      </div>
    </div>
    <button hlmMessageScrollerButton></button>
  </div>
</div>
`;
