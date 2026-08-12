import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideArrowUp,
	lucideAtSign,
	lucideCheck,
	lucideCode,
	lucideCopy,
	lucideGlobe,
	lucideImage,
	lucideMonitor,
	lucidePaperclip,
	lucidePlus,
	lucideX,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmHoverCardImports } from '@spartan-ng/helm/hover-card';
import { HlmInputGroup, HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

type ModelGroup = { name: string; models: string[] };

const modelGroups: ModelGroup[] = [
	{ name: 'OpenAI', models: ['GPT-4o', 'GPT-4o Mini'] },
	{ name: 'Anthropic', models: ['Claude 4 Opus', 'Claude 4 Sonnet'] },
	{ name: 'Google', models: ['Gemini 2.0 Flash'] },
];

function handlePromptKeydown(event: KeyboardEvent): void {
	if (event.key !== 'Enter') {
		return;
	}

	const target = event.target as HTMLTextAreaElement | null;
	const hasText = Boolean(target?.value?.trim().length);

	if (!event.shiftKey || !hasText) {
		event.preventDefault();
	}
}

// ── Basic Composer ───────────────────────────────────────────────────────────

@Component({
	selector: 'prompt-input-basic-composer-story',
	imports: [HlmButton, HlmInputGroupImports, HlmCommandImports, HlmDialogImports, HlmDropdownMenuImports, NgIcon],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-3xl p-4">
			<div hlmInputGroup>
				<textarea
					hlmInputGroupTextarea
					rows="2"
					placeholder="Ask anything..."
					class="field-sizing-fixed h-18 max-h-18 w-full min-w-0 resize-none overflow-y-auto"
					(keydown)="handlePromptKeydown($event)"
				></textarea>
				<div hlmInputGroupAddon align="block-end" class="gap-0.5 px-1.5 pb-1.5">
					<button
						hlmInputGroupButton
						variant="ghost"
						class="rounded-full"
						size="icon-sm"
						aria-label="Add attachment"
						[hlmDropdownMenuTrigger]="attachMenu"
					>
						<ng-icon name="lucidePlus" />
					</button>
					<ng-template #attachMenu>
						<hlm-dropdown-menu>
							<button hlmDropdownMenuItem>
								<ng-icon name="lucideImage" />
								<span>Add photos or files</span>
							</button>
							<button hlmDropdownMenuItem>
								<ng-icon name="lucideMonitor" />
								<span>Take screenshot</span>
							</button>
						</hlm-dropdown-menu>
					</ng-template>
					<hlm-dialog>
						<button hlmInputGroupButton class="h-8 rounded-full px-3" size="sm" hlmDialogTrigger>
							{{ selectedModel() }}
						</button>
						<hlm-dialog-content
							class="sm:!w-[24rem] sm:!max-w-[24rem]"
							[showCloseButton]="false"
							*hlmDialogPortal="let ctx"
						>
							<hlm-command>
								<hlm-dialog-header class="flex-row items-center gap-2">
									<h3 hlmDialogTitle class="sr-only">Select model</h3>
									<p hlmDialogDescription class="sr-only">Choose the model for this prompt.</p>
									<hlm-command-input placeholder="Search models..." class="flex-1" />
									<button hlmBtn variant="ghost" size="icon-sm" hlmDialogClose>
										<span class="sr-only">Close</span>
										<ng-icon name="lucideX" />
									</button>
								</hlm-dialog-header>
								<hlm-command-list class="mt-3">
									@for (group of modelGroups; track group.name) {
										<hlm-command-group>
											<hlm-command-group-label>{{ group.name }}</hlm-command-group-label>
											@for (model of group.models; track model) {
												<button
													hlm-command-item
													class="w-full"
													[value]="model"
													(click)="selectModel(model); ctx.close()"
												>
													<span>{{ model }}</span>
													@if (selectedModel() === model) {
														<hlm-command-shortcut>
															<ng-icon name="lucideCheck" />
														</hlm-command-shortcut>
													}
												</button>
											}
										</hlm-command-group>
									}
								</hlm-command-list>
							</hlm-command>
						</hlm-dialog-content>
					</hlm-dialog>
					<button
						hlmInputGroupButton
						variant="default"
						class="ml-auto rounded-full"
						size="icon-sm"
						aria-label="Submit prompt"
					>
						<ng-icon name="lucideArrowUp" />
					</button>
				</div>
			</div>
		</div>
	`,
})
class PromptInputBasicComposerStory {
	public readonly handlePromptKeydown = handlePromptKeydown;
	public readonly modelGroups = modelGroups;
	public readonly selectedModel = signal('GPT-4o');

	public selectModel(model: string): void {
		this.selectedModel.set(model);
	}
}

// ── With Tools ───────────────────────────────────────────────────────────────

@Component({
	selector: 'prompt-input-with-tools-story',
	imports: [HlmButton, HlmInputGroupImports, HlmCommandImports, HlmDialogImports, HlmHoverCardImports, NgIcon],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="w-full max-w-3xl p-4">
			<div hlmInputGroup>
				<div hlmInputGroupAddon align="block-start" class="no-scrollbar overflow-y-auto">
					<hlm-hover-card>
						<button
							hlmInputGroupButton
							variant="outline"
							class="rounded-full"
							size="icon-sm"
							hlmHoverCardTrigger
							[showDelay]="120"
							[hideDelay]="100"
							[animationDelay]="0"
						>
							<ng-icon name="lucideAtSign" />
						</button>
						<hlm-hover-card-content *hlmHoverCardPortal class="w-[700px] max-w-[90vw] p-0">
							<hlm-command class="rounded-xl border-0 text-left shadow-none">
								<hlm-command-input placeholder="Add files, folders, docs..." />
								<hlm-command-list>
									<hlm-command-group>
										<hlm-command-group-label>Added</hlm-command-group-label>
										<button hlm-command-item value="active-tabs" class="text-left">
											<ng-icon name="lucideGlobe" />
											<span>Active Tabs</span>
											<hlm-command-shortcut>
												<ng-icon name="lucideCheck" />
											</hlm-command-shortcut>
										</button>
									</hlm-command-group>
									<hlm-command-separator />
									<hlm-command-group>
										<hlm-command-group-label>Other Files</hlm-command-group-label>
										<button hlm-command-item value="prompt-input-tsx" class="items-start text-left">
											<ng-icon name="lucideGlobe" />
											<span class="flex min-w-0 flex-1 flex-col">
												<span>prompt-input.tsx</span>
												<span class="text-muted-foreground text-xs">packages/elements/src</span>
											</span>
										</button>
										<button hlm-command-item value="queue-tsx-examples" class="items-start text-left">
											<ng-icon name="lucideGlobe" />
											<span class="flex min-w-0 flex-1 flex-col">
												<span>queue.tsx</span>
												<span class="text-muted-foreground text-xs">apps/test/app/examples</span>
											</span>
										</button>
										<button hlm-command-item value="queue-tsx-elements" class="items-start text-left">
											<ng-icon name="lucideGlobe" />
											<span class="flex min-w-0 flex-1 flex-col">
												<span>queue.tsx</span>
												<span class="text-muted-foreground text-xs">packages/elements/src</span>
											</span>
										</button>
									</hlm-command-group>
								</hlm-command-list>
							</hlm-command>
						</hlm-hover-card-content>
					</hlm-hover-card>
					<button hlmInputGroupButton variant="outline" class="rounded-full" size="sm" aria-label="Attachments">
						<ng-icon name="lucidePaperclip" />
						<span>1</span>
					</button>
					<button hlmInputGroupButton variant="outline" class="rounded-full" size="sm" aria-label="Tab count">
						<ng-icon name="lucideCopy" />
						<span>1 Tab</span>
					</button>
				</div>
				<textarea
					hlmInputGroupTextarea
					rows="2"
					placeholder="Plan, search, build anything"
					class="field-sizing-fixed h-18 max-h-18 w-full min-w-0 resize-none overflow-y-auto"
					(keydown)="handlePromptKeydown($event)"
				></textarea>
				<div hlmInputGroupAddon align="block-end" class="gap-1 px-1.5 pb-1.5">
					<hlm-dialog>
						<button hlmInputGroupButton variant="ghost" class="h-8 rounded-full px-3" size="sm" hlmDialogTrigger>
							{{ selectedModel() }}
						</button>
						<hlm-dialog-content
							class="sm:!w-[24rem] sm:!max-w-[24rem]"
							[showCloseButton]="false"
							*hlmDialogPortal="let ctx"
						>
							<hlm-command>
								<hlm-dialog-header class="flex-row items-center gap-2">
									<h3 hlmDialogTitle class="sr-only">Select model</h3>
									<p hlmDialogDescription class="sr-only">Choose the model for this prompt.</p>
									<hlm-command-input placeholder="Search models..." class="flex-1" />
									<button hlmBtn variant="ghost" size="icon-sm" hlmDialogClose>
										<span class="sr-only">Close</span>
										<ng-icon name="lucideX" />
									</button>
								</hlm-dialog-header>
								<hlm-command-list class="mt-3">
									@for (group of modelGroups; track group.name) {
										<hlm-command-group>
											<hlm-command-group-label>{{ group.name }}</hlm-command-group-label>
											@for (model of group.models; track model) {
												<button
													hlm-command-item
													class="w-full"
													[value]="model"
													(click)="selectModel(model); ctx.close()"
												>
													<span>{{ model }}</span>
													@if (selectedModel() === model) {
														<hlm-command-shortcut>
															<ng-icon name="lucideCheck" />
														</hlm-command-shortcut>
													}
												</button>
											}
										</hlm-command-group>
									}
								</hlm-command-list>
							</hlm-command>
						</hlm-dialog-content>
					</hlm-dialog>
					<button
						hlmInputGroupButton
						variant="default"
						class="ml-auto rounded-full"
						size="icon-sm"
						aria-label="Submit prompt"
					>
						<ng-icon name="lucideArrowUp" />
					</button>
				</div>
			</div>
		</div>
	`,
})
class PromptInputWithToolsStory {
	public readonly handlePromptKeydown = handlePromptKeydown;
	public readonly modelGroups = modelGroups;
	public readonly selectedModel = signal('GPT-4o');

	public selectModel(model: string): void {
		this.selectedModel.set(model);
	}
}

const meta: Meta<HlmInputGroup> = {
	title: 'AI Elements/Prompt Input',
	component: HlmInputGroup,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [PromptInputBasicComposerStory, PromptInputWithToolsStory],
			providers: [
				provideIcons({
					lucideAtSign,
					lucideArrowUp,
					lucideCheck,
					lucideCode,
					lucideCopy,
					lucideGlobe,
					lucideImage,
					lucideMonitor,
					lucidePaperclip,
					lucidePlus,
					lucideX,
				}),
			],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmInputGroup>;

export const BasicComposer: Story = {
	render: () => ({
		template: '<prompt-input-basic-composer-story />',
	}),
};

export const WithTools: Story = {
	render: () => ({
		template: '<prompt-input-with-tools-story />',
	}),
};
