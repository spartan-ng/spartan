import { signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideArrowUp,
	lucideCheck,
	lucideChevronDown,
	lucideCode,
	lucideFileText,
	lucideGlobe,
	lucideImage,
	lucideMonitor,
	lucidePaperclip,
	lucidePlus,
	lucideSearch,
	lucideSparkles,
	lucideX,
} from '@ng-icons/lucide';
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmInputGroup, HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmInputGroup> = {
	title: 'AI Elements/Prompt Input',
	component: HlmInputGroup,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmInputGroupImports, HlmAttachmentImports, HlmDropdownMenuImports, HlmSeparator, NgIcon],
			providers: [
				provideIcons({
					lucideArrowUp,
					lucideCheck,
					lucideChevronDown,
					lucideCode,
					lucideFileText,
					lucideGlobe,
					lucideImage,
					lucideMonitor,
					lucidePaperclip,
					lucidePlus,
					lucideSearch,
					lucideSparkles,
					lucideX,
				}),
			],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmInputGroup>;

const handlePromptKeydown = (event: KeyboardEvent) => {
	if (event.key !== 'Enter') {
		return;
	}

	const target = event.target as HTMLTextAreaElement | null;
	const hasText = Boolean(target?.value?.trim().length);

	if (!event.shiftKey || !hasText) {
		event.preventDefault();
	}
};

export const BasicComposer: Story = {
	render: () => ({
		props: (() => {
			const selectedModel = signal('Auto');
			const storyProps = {
				handlePromptKeydown,
				modelOptions: ['Auto', 'Fast', 'Thinking'],
				selectedModel,
				selectModel: (model: string) => {
					selectedModel.set(model);
				},
			};

			return storyProps;
		})(),
		template: `
			<div class="w-full max-w-3xl p-4">
				<div hlmInputGroup class="[--radius:1.2rem]">
					<textarea
						hlmInputGroupTextarea
						rows="2"
						placeholder="Ask anything..."
						class="h-18 max-h-18 w-full min-w-0 field-sizing-fixed overflow-y-auto resize-none"
						(keydown)="handlePromptKeydown($event)"
					></textarea>
					<div hlmInputGroupAddon align="block-end">
						<button
							hlmInputGroupButton
							variant="outline"
							class="rounded-full"
							size="icon-sm"
							aria-label="Add attachment"
							[hlmDropdownMenuTrigger]="attachMenu"
						>
							<ng-icon name="lucidePlus" />
						</button>
						<ng-template #attachMenu>
							<hlm-dropdown-menu class="w-56">
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
						<button hlmInputGroupButton class="rounded-full" size="sm" [hlmDropdownMenuTrigger]="modelMenu">
							{{ selectedModel() }}
							<ng-icon name="lucideChevronDown" />
						</button>
						<ng-template #modelMenu>
							<hlm-dropdown-menu class="w-44">
								<hlm-dropdown-menu-label class="text-muted-foreground text-xs">Mode</hlm-dropdown-menu-label>
								<hlm-dropdown-menu-separator />
								@for (model of modelOptions; track model) {
									<button hlmDropdownMenuItem class="flex justify-between" (click)="selectModel(model)">
										<span>{{ model }}</span>
										@if (selectedModel() === model) {
											<ng-icon name="lucideCheck" />
										}
									</button>
								}
							</hlm-dropdown-menu>
						</ng-template>
						<span class="ml-auto"></span>
						<button hlmInputGroupButton variant="default" class="rounded-full" size="icon-sm" aria-label="Submit prompt">
							<ng-icon name="lucideArrowUp" />
						</button>
					</div>
				</div>
			</div>
		`,
	}),
};

export const WithTools: Story = {
	render: () => ({
		props: { handlePromptKeydown },
		template: `
			<div class="w-full max-w-3xl p-4">
				<div hlmInputGroup class="[--radius:1.2rem]">
					<div hlmInputGroupAddon align="block-start" class="no-scrollbar overflow-y-auto">
						<button hlmInputGroupButton variant="secondary" class="rounded-full" size="sm">
							<ng-icon name="lucideSearch" />
							Search
						</button>
						<button hlmInputGroupButton variant="secondary" class="rounded-full" size="sm">
							<ng-icon name="lucideSparkles" />
							Reason
						</button>
						<button hlmInputGroupButton variant="secondary" class="rounded-full" size="sm">
							<ng-icon name="lucideCode" />
							Code
						</button>
					</div>
					<textarea
						hlmInputGroupTextarea
						rows="2"
						placeholder="Ask, Search, or make anything..."
						class="h-18 max-h-18 w-full min-w-0 field-sizing-fixed overflow-y-auto resize-none"
						(keydown)="handlePromptKeydown($event)"
					></textarea>
					<div hlmInputGroupAddon align="block-end">
						<button hlmInputGroupButton class="rounded-full" size="sm">
							<ng-icon name="lucideSparkles" />
							Auto
						</button>
						<button hlmInputGroupButton class="rounded-full" size="sm">
							<ng-icon name="lucideGlobe" />
							All sources
						</button>
						<button hlmInputGroupButton variant="outline" class="rounded-full" size="icon-sm" aria-label="Attach file">
							<ng-icon name="lucidePaperclip" />
						</button>
						<button hlmInputGroupButton variant="default" class="rounded-full ms-auto" size="icon-sm" aria-label="Submit prompt">
							<ng-icon name="lucideArrowUp" />
						</button>
					</div>
				</div>
			</div>
		`,
	}),
};

export const WithAttachments: Story = {
	render: () => ({
		props: { handlePromptKeydown },
		template: `
			<div class="w-full max-w-3xl p-4">
				<div hlmInputGroup class="[--radius:1.2rem]">
					<div hlmInputGroupAddon align="block-start" class="flex-col">
						<div hlmAttachment size="sm">
							<div hlmAttachmentMedia>
								<ng-icon name="lucideFileText" />
							</div>
							<div hlmAttachmentContent>
								<span hlmAttachmentTitle>dashboard-spec.md</span>
								<span hlmAttachmentDescription>Markdown · 148 KB</span>
							</div>
							<div hlmAttachmentActions>
								<button hlmAttachmentAction aria-label="Remove attachment">
									<ng-icon name="lucideX" />
								</button>
							</div>
						</div>
						<div hlmAttachment size="sm">
							<div hlmAttachmentMedia>
								<ng-icon name="lucideFileText" />
							</div>
							<div hlmAttachmentContent>
								<span hlmAttachmentTitle>search-ux-notes.txt</span>
								<span hlmAttachmentDescription>Text · 19 KB</span>
							</div>
							<div hlmAttachmentActions>
								<button hlmAttachmentAction aria-label="Remove attachment">
									<ng-icon name="lucideX" />
								</button>
							</div>
						</div>
					</div>
					<textarea
						hlmInputGroupTextarea
						rows="2"
						placeholder="Summarize these files and propose next steps..."
						class="h-18 max-h-18 w-full min-w-0 field-sizing-fixed overflow-y-auto resize-none"
						(keydown)="handlePromptKeydown($event)"
					></textarea>
					<div hlmInputGroupAddon align="block-end">
						<button hlmInputGroupButton variant="outline" class="rounded-full" size="icon-sm" aria-label="Attach file">
							<ng-icon name="lucidePaperclip" />
						</button>
						<span hlmInputGroupText class="text-muted-foreground ml-auto">2 attachments</span>
						<hlm-separator orientation="vertical" class="!h-4" />
						<button hlmInputGroupButton variant="default" class="rounded-full" size="icon-sm" aria-label="Submit prompt">
							<ng-icon name="lucideArrowUp" />
						</button>
					</div>
				</div>
			</div>
		`,
	}),
};
