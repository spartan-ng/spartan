import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideMessageCircleDashed, lucideRotateCw } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmMessageScrollerImports } from '@spartan-ng/helm/message-scroller';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { MessageScrollerTranscriptRow } from './message-scroller-transcript-row';
import { ANIMATION_SCRIPT, ScriptedChatRunner } from './message-scroller.shared';

type AnimationPreset = {
	id: string;
	name: string;
	className: string;
};

const ANIMATION_PRESETS: AnimationPreset[] = [
	{
		id: 'fade',
		name: 'Fade',
		className: 'motion-safe:animate-in motion-safe:fade-in duration-200',
	},
	{
		id: 'slide-up',
		name: 'Slide Up',
		className: 'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 duration-300',
	},
	{
		id: 'slide-side',
		name: 'Slide Side',
		className: 'motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-4 duration-300',
	},
	{
		id: 'pop',
		name: 'Pop',
		className:
			'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:slide-in-from-bottom-2 origin-bottom-right duration-300',
	},
	{
		id: 'spring-bounce',
		name: 'Spring Bounce',
		className:
			'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:slide-in-from-bottom-3 duration-500',
	},
	{
		id: 'blur-fade',
		name: 'Blur Fade',
		className: 'motion-safe:animate-in motion-safe:fade-in motion-safe:blur-in duration-300',
	},
	{
		id: 'scale-fade',
		name: 'Scale Fade',
		className: 'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 duration-300',
	},
];

@Component({
	selector: 'spartan-message-scroller-animation-preview',
	imports: [
		HlmMessageScrollerImports,
		HlmCardImports,
		HlmButtonImports,
		HlmEmptyImports,
		HlmSelectImports,
		MessageScrollerTranscriptRow,
		NgIcon,
	],
	providers: [provideIcons({ lucideArrowUp, lucideMessageCircleDashed, lucideRotateCw })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'relative flex w-full max-w-sm flex-col gap-4',
	},
	template: `
		<div class="relative flex flex-col gap-4">
			<hlm-card class="mx-auto h-[35rem] w-full max-w-sm gap-0">
				<hlm-card-header class="border-b">
					<h3 hlmCardTitle>Animation</h3>
					<p hlmCardDescription>Choose how user messages are animated when they are added to the conversation.</p>
					<div hlmCardAction class="flex items-center gap-2">
						<button
							hlmBtn
							type="button"
							variant="outline"
							size="icon"
							aria-label="Reset animated messages"
							[disabled]="_chat.messages().length === 0 || _chat.isBusy()"
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
								<div hlmEmptyTitle>No Messages Yet</div>
								<div hlmEmptyDescription>Click the button below to send the first message.</div>
							</hlm-empty-header>
						</hlm-empty>
					} @else {
						<div hlmMessageScrollerProvider>
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
												userVariant="muted"
												assistantVariant="ghost"
												[animationClass]="message.role === 'user' ? _selectedPreset().className : ''"
											/>
										}
									</div>
								</div>
								<button hlmMessageScrollerButton></button>
							</div>
						</div>
					}
				</div>

				<hlm-card-footer class="border-t">
					<hlm-select [value]="_presetId()" (valueChange)="onPresetChange($event)" [itemToString]="_presetToString">
						<hlm-select-trigger aria-label="Animation preset">
							<hlm-select-value />
						</hlm-select-trigger>
						<hlm-select-content *hlmSelectPortal>
							@for (preset of _presets; track preset.id) {
								<hlm-select-item [value]="preset.id">{{ preset.name }}</hlm-select-item>
							}
						</hlm-select-content>
					</hlm-select>

					<button
						hlmBtn
						type="button"
						size="icon"
						class="ms-auto"
						[disabled]="!_chat.nextMessage() || _chat.isBusy()"
						(click)="sendNext()"
					>
						<ng-icon name="lucideArrowUp" />
						<span class="sr-only">Send Message</span>
					</button>
				</hlm-card-footer>
			</hlm-card>
		</div>

		<div class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs text-balance">
			Select an animation then click send to see it in action.
		</div>
	`,
})
export class MessageScrollerAnimationPreview {
	protected readonly _presets = ANIMATION_PRESETS;

	protected readonly _presetId = signal(ANIMATION_PRESETS[0].id);
	protected readonly _chat = new ScriptedChatRunner(ANIMATION_SCRIPT, {
		streamDelayMs: 15,
		thinkDelayMs: 1000,
	});

	protected readonly _selectedPreset = computed(
		() => this._presets.find((preset) => preset.id === this._presetId()) ?? this._presets[0],
	);

	protected readonly _presetToString = (value: string | null | undefined) =>
		this._presets.find((preset) => preset.id === value)?.name ?? '';

	protected onPresetChange(value: string | null | undefined): void {
		if (value) {
			this._presetId.set(value);
		}
	}

	protected reset(): void {
		this._chat.reset();
	}

	protected sendNext(): void {
		if (!this._chat.nextMessage() || this._chat.isBusy()) {
			return;
		}
		void this._chat.sendNext();
	}
}
