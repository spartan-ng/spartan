import { computed, signal } from '@angular/core';

export type DemoMessage = {
	id: string;
	role: 'user' | 'assistant';
	text: string;
};

export type DemoMessageRole = DemoMessage['role'];

/** Mirrors AI SDK useChat status values used by the shadcn demos. */
export type DemoChatStatus = 'ready' | 'submitted' | 'streaming';

export function splitParagraphs(text: string): string[] {
	return text
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);
}

export function trimMessageText(text: string, max = 42): string {
	return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ScriptedChatRunner {
	public readonly messages = signal<DemoMessage[]>([]);
	public readonly status = signal<DemoChatStatus>('ready');

	private readonly _cursor = signal(0);
	private _generation = 0;

	/** Next scripted message, or undefined when the script is exhausted. */
	public readonly nextMessage = computed(() => this.script[this._cursor()]);

	/** True while a turn is submitted or streaming — matches shadcn `isBusy`. */
	public readonly isBusy = computed(() => {
		const status = this.status();
		return status === 'submitted' || status === 'streaming';
	});

	constructor(
		private readonly script: DemoMessage[],
		private readonly options: {
			streamDelayMs?: number;
			/** Delay before assistant tokens start (shadcn `.sleep(1000)`). */
			thinkDelayMs?: number;
			initialCount?: number;
		} = {},
	) {
		this.reset(options.initialCount ?? 0);
	}

	public reset(initialCount = 0): void {
		this._generation++;
		this.messages.set(this.script.slice(0, initialCount));
		this._cursor.set(initialCount);
		this.status.set('ready');
	}

	/**
	 * Advances one chat turn — matching shadcn `sendMessage(nextMessage)`:
	 * append the next user message, then automatically think + stream the
	 * following assistant reply without requiring another send.
	 */
	public async sendNext(): Promise<void> {
		const next = this.nextMessage();

		if (!next || this.isBusy()) {
			return;
		}

		const generation = ++this._generation;
		this.status.set('submitted');
		this._cursor.update((cursor) => cursor + 1);

		if (next.role === 'user') {
			this.messages.update((messages) => [...messages, next]);

			const assistant = this.nextMessage();
			if (!assistant || assistant.role !== 'assistant') {
				if (generation === this._generation) {
					this.status.set('ready');
				}
				return;
			}

			this._cursor.update((cursor) => cursor + 1);
			await this.streamAssistant(assistant, generation);
			return;
		}

		await this.streamAssistant(next, generation);
	}

	private async streamAssistant(message: DemoMessage, generation: number): Promise<void> {
		const thinkDelay = this.options.thinkDelayMs ?? 1000;
		if (thinkDelay > 0) {
			await sleep(thinkDelay);
			if (generation !== this._generation) {
				return;
			}
		}

		this.messages.update((messages) => [...messages, { ...message, text: '' }]);
		this.status.set('streaming');

		const fullText = message.text;
		const chunkSize = 4;
		const delay = this.options.streamDelayMs ?? 20;

		for (let index = 0; index < fullText.length; index += chunkSize) {
			await sleep(delay);
			if (generation !== this._generation) {
				return;
			}

			const text = fullText.slice(0, Math.min(index + chunkSize, fullText.length));
			this.messages.update((messages) =>
				messages.map((entry) => (entry.id === message.id ? { ...entry, text } : entry)),
			);
		}

		if (generation === this._generation) {
			this.status.set('ready');
		}
	}
}

export const MAIN_CHAT_SCRIPT: DemoMessage[] = [
	{
		id: 'chat-1',
		role: 'user',
		text: "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around.",
	},
	{
		id: 'chat-2',
		role: 'assistant',
		text: "That's the classic streaming scroll problem. Wrap your message list in `MessageScroller` and turn on `autoScroll` — the viewport pins to the bottom as tokens arrive, so users always see the latest text land in place.\n\nThe important part: it only auto-scrolls while the reader is already at the bottom. The moment they scroll up to read something earlier, auto-scroll backs off and their position is preserved. You get smooth streaming without fighting the user's intent.",
	},
	{
		id: 'chat-3',
		role: 'user',
		text: 'Okay, but when someone sends a new message the view still feels jarring — like the whole conversation reloads from the top.',
	},
	{
		id: 'chat-4',
		role: 'assistant',
		text: "MessageScrollerItem fixes that with turn anchoring. Set `scrollAnchor` on the turn that should settle near the top instead of blindly snapping to the document bottom.\n\nIt also leaves a small peek of the previous exchange visible above the anchor, so context isn't lost. The reply starts in view without that disorienting jump you get from a plain overflow container.",
	},
	{
		id: 'chat-5',
		role: 'user',
		text: "And if they've scrolled up to re-read an older answer? I don't want to yank them back down.",
	},
	{
		id: 'chat-6',
		role: 'assistant',
		text: "You won't. Auto-scroll only runs when the viewport is already pinned to the bottom, so scrolling up is a deliberate opt-out — their place in the thread stays put even as new tokens keep arriving below.\n\nWhen there is content they haven't seen yet, `MessageScrollerButton` appears at the bottom of the viewport. One tap jumps them back to the newest message and re-engages auto-scroll. Same pattern as Slack or iMessage: quiet when you're caught up, helpful when you're not.",
	},
	{
		id: 'chat-7',
		role: 'user',
		text: 'Last one — does this work with assistive tech?',
	},
	{
		id: 'chat-8',
		role: 'assistant',
		text: '`MessageScrollerContent` sets `role="log"` and `aria-relevant="additions"` by default, so screen readers announce new messages as they stream in.\n\nThe scroll button is a real `<button>` with an sr-only label, and it\'s removed from the tab order when you\'re already at the bottom — no ghost focus stops.',
	},
];

export const ANCHORING_SCRIPT: DemoMessage[] = [
	{
		id: 'anchor-1-user',
		role: 'user',
		text: 'Can you show me how anchoring behaves when a new prompt starts the turn?',
	},
	{
		id: 'anchor-1-assistant',
		role: 'assistant',
		text: 'Append the user prompt first, then append the assistant response. With User selected, the prompt settles near the top and the assistant response fills in below it.',
	},
	{
		id: 'anchor-2-user',
		role: 'user',
		text: 'What changes when assistant messages are the anchor?',
	},
	{
		id: 'anchor-2-assistant',
		role: 'assistant',
		text: 'Now each assistant response is the item `MessageScroller` keeps in view. This is useful when the reply is the moment you want readers to land on after each turn.',
	},
	{
		id: 'anchor-3-user',
		role: 'user',
		text: 'Can I switch roles and keep adding turns?',
	},
	{
		id: 'anchor-3-assistant',
		role: 'assistant',
		text: 'Yes. The next appended message with the selected role becomes the anchor, so you can compare user and assistant anchoring without resetting the demo.',
	},
];

export const HISTORY_SCRIPT: DemoMessage[] = [
	{
		id: 'history-1',
		role: 'user',
		text: 'Can you summarize the incident channel?',
	},
	{
		id: 'history-2',
		role: 'assistant',
		text: 'The first alert was a delayed export job. It started backing up around 09:42 UTC and triggered the warning once the retry queue crossed the threshold.\n\nNo customer-facing checkout paths were affected, but exports for larger workspaces were running about 12 minutes behind.',
	},
	{
		id: 'history-3',
		role: 'user',
		text: 'Was checkout affected?',
	},
	{
		id: 'history-4',
		role: 'assistant',
		text: 'No checkout errors were reported. Payment authorization, order creation, and confirmation emails stayed inside their normal latency bands.\n\nThe only elevated metric was export queue depth, which maps to analytics downloads instead of checkout.',
	},
	{
		id: 'history-5',
		role: 'user',
		text: 'What changed in the last deploy?',
	},
	{
		id: 'history-6',
		role: 'assistant',
		text: 'Only the export queue worker changed. The deploy moved large CSV jobs onto the shared retry policy, which made each failed attempt hold a worker slot longer than before.\n\nThe app deploy did not include checkout, pricing, or billing API changes.',
	},
	{
		id: 'history-7',
		role: 'user',
		text: 'Do we need to roll back?',
	},
	{
		id: 'history-8',
		role: 'assistant',
		text: 'Not yet. Queue depth is recovering after we reduced retry concurrency, and the oldest pending job is now under five minutes old.\n\nKeep rollback ready if the queue starts climbing again, but the current trend points toward recovery.',
	},
	{
		id: 'history-9',
		role: 'user',
		text: 'Keep watching for customer-visible issues.',
	},
	{
		id: 'history-10',
		role: 'assistant',
		text: 'I will watch the queue and support tags for another 15 minutes. I am tracking export failures, delayed download requests, and any support thread that mentions missing reports.\n\nIf those stay quiet through the next batch window, we can close this as an internal degradation.',
	},
];

export const COMMANDS_SCRIPT: DemoMessage[] = [
	{
		id: 'command-activation',
		role: 'user',
		text: "We're seeing activation dip after workspace creation. Can you help me find the likely step?",
	},
	{
		id: 'command-activation-a',
		role: 'assistant',
		text: 'The sharpest drop is between creating the workspace and inviting the first teammate.\n\nWorkspace creation is still healthy, but the invite step is where users pause. That suggests the product is asking for collaboration before the user has enough confidence in the workspace.',
	},
	{
		id: 'command-compare',
		role: 'user',
		text: 'What should I compare before we change the onboarding flow?',
	},
	{
		id: 'command-compare-a',
		role: 'assistant',
		text: 'Compare three cohorts:\n\n1. Users who choose a template before inviting teammates.\n2. Users who start from a blank workspace.\n3. Users who skip invites and return within 24 hours.\n\nIf template users invite faster, the fix is probably better first-run guidance rather than a louder invite prompt.',
	},
	{
		id: 'command-experiment',
		role: 'user',
		text: 'Can you turn that into an experiment?',
	},
	{
		id: 'command-experiment-a',
		role: 'assistant',
		text: 'Yes. Create a variant that shows a short checklist after workspace creation:\n\n- Pick a template.\n- Add one project detail.\n- Invite a teammate when the workspace has context.\n\nMeasure first invite completion, 24-hour return rate, and whether teams create a second project.',
	},
	{
		id: 'command-risk',
		role: 'user',
		text: "What's the risk if we delay the invite prompt?",
	},
	{
		id: 'command-risk-a',
		role: 'assistant',
		text: 'The main risk is reducing team creation for accounts that already know who they want to invite.\n\nTo protect that path, keep the invite action visible in the header and only change the primary empty-state guidance. That gives confident teams a direct route without forcing uncertain users through the invite step too early.',
	},
];

export const VISIBILITY_SCRIPT: DemoMessage[] = [
	{
		id: 'vis-brief',
		role: 'user',
		text: 'Review the incident handoff and tell me what to read first.',
	},
	{
		id: 'vis-brief-a',
		role: 'assistant',
		text: 'Start with the summary and the impact section. The regression affected the upload queue, but the recovery path completed for every queued job.',
	},
	{
		id: 'vis-impact',
		role: 'user',
		text: 'What was the customer impact?',
	},
	{
		id: 'vis-impact-a',
		role: 'assistant',
		text: 'Impact was limited to delayed processing.\n\nNo records were dropped, and the reconciliation worker confirmed each retry batch. Support saw confusion from two customers, but there were no checkout or billing errors.',
	},
	{
		id: 'vis-actions',
		role: 'user',
		text: 'What actions are open?',
	},
	{
		id: 'vis-actions-a',
		role: 'assistant',
		text: 'Keep the retry window enabled until the next deploy, then add a queue-depth alert as the long-term fix.\n\nThe alert should fire on sustained queue growth, not a single short spike.',
	},
	{
		id: 'vis-checklist',
		role: 'user',
		text: 'Give me the follow-up checklist.',
	},
	{
		id: 'vis-checklist-a',
		role: 'assistant',
		text: 'After that, compare the queue recovery graph with the deploy timeline so the handoff shows exactly when processing returned to baseline. That makes it easier for support and engineering to answer the same customer questions without re-reading the whole incident thread.\n\nI would also add a short owner note beside each follow-up item. The checklist is small, but ownership keeps the retry-window decision, alert tuning, and support macro from drifting into separate follow-up conversations.\n\nKeep the retry window enabled until the next deploy, then add a queue-depth alert as the long-term fix.\n\nThe alert should fire on sustained queue growth, not a single short spike.',
	},
];

export const OPENING_POSITION_SCRIPT: DemoMessage[] = [
	{
		id: 'open-1',
		role: 'user',
		text: 'This is the first message the user sent in the conversation.',
	},
	{
		id: 'open-2',
		role: 'assistant',
		text: 'Workspace creation rose 8%, but first invite completion only rose 2%.',
	},
	{
		id: 'open-3',
		role: 'user',
		text: 'This is the last message the user sent in the conversation.',
	},
	{
		id: 'open-4',
		role: 'assistant',
		text: 'Start with the invite step. Teams are creating workspaces but waiting to add collaborators.\n\nRecommended follow-up:\n\n1. Compare invite drop-off by account size.\n2. Check whether users who skip invites still return within 24 hours.\n3. Review the empty-state copy on the first project screen.\n4. Segment activation by template, since template users may not need invites right away.\n\nIf that pattern holds, the next experiment should make collaboration useful earlier instead of prompting for invites harder.',
	},
];

export const ANIMATION_SCRIPT: DemoMessage[] = [
	{
		id: 'animation-1',
		role: 'user',
		text: 'Can user messages pop in like iMessage without breaking anchoring?',
	},
	{
		id: 'animation-1-a',
		role: 'assistant',
		text: 'Yes. Animate the user row with transform and opacity, and let the assistant response stream normally below it.\n\nThat keeps the row measurement predictable while still giving the newly sent bubble a more tactile entrance.',
	},
	{
		id: 'animation-2',
		role: 'user',
		text: 'What makes the animation feel more like iMessage?',
	},
	{
		id: 'animation-2-a',
		role: 'assistant',
		text: 'Use a quick spring from the trailing edge: a little scale, a small upward move, and no layout animation.\n\nThe bubble feels tactile, but the measured row stays predictable, so anchoring and auto-scroll do not have to fight a changing layout.',
	},
	{
		id: 'animation-3',
		role: 'user',
		text: 'Can I switch between presets while testing the same thread?',
	},
	{
		id: 'animation-3-a',
		role: 'assistant',
		text: 'Yes. Keep the conversation in place while you change the preset, then send the next message to compare the new entrance against the same context.\n\nThat makes it easier to judge the difference between a subtle fade, a snappy pop, and a more dramatic 3D tilt without rebuilding the scenario each time.',
	},
];

export function createScrollableScript(count = 12): DemoMessage[] {
	return Array.from({ length: count }, (_, index) => ({
		id: `scrollable-${index + 1}`,
		role: (index % 2 === 0 ? 'user' : 'assistant') as DemoMessageRole,
		text:
			index % 2 === 0
				? `Review scroll checkpoint ${index + 1}.`
				: `Checkpoint ${index + 1} is synced. The scrollable hook updates as the viewport moves.\n\nWhen the reader is at the first message, the footer should only point them down. Once they move into the middle of the transcript, it should explain that both directions are available.\n\nAt the latest message, the footer should switch again and only point them back up.`,
	}));
}
