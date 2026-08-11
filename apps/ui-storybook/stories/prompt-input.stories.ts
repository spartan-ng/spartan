import { signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideAtSign,
	lucideArrowUp,
	lucideCheck,
	lucideChevronDown,
	lucideCode,
	lucideCopy,
	lucideGlobe,
	lucideImage,
	lucideMonitor,
	lucidePaperclip,
	lucidePlus,
	lucideSearch,
	lucideSparkles,
} from '@ng-icons/lucide';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmHoverCardImports } from '@spartan-ng/helm/hover-card';
import { HlmInputGroup, HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmInputGroup> = {
	title: 'AI Elements/Prompt Input',
	component: HlmInputGroup,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [
				HlmInputGroupImports,
				HlmCommandImports,
				HlmDropdownMenuImports,
				HlmHoverCardImports,
				NgIcon,
			],
			providers: [
				provideIcons({
					lucideAtSign,
					lucideArrowUp,
					lucideCheck,
					lucideChevronDown,
					lucideCode,
					lucideCopy,
					lucideGlobe,
					lucideImage,
					lucideMonitor,
					lucidePaperclip,
					lucidePlus,
					lucideSearch,
					lucideSparkles,
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
							variant="ghost"
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
						<hlm-hover-card>
							<button
								hlmInputGroupButton
								variant="outline"
								class="rounded-[12px]"
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
												<span class="min-w-0 flex flex-1 flex-col">
													<span>prompt-input.tsx</span>
													<span class="text-muted-foreground text-xs">packages/elements/src</span>
												</span>
											</button>
											<button hlm-command-item value="queue-tsx-examples" class="items-start text-left">
												<ng-icon name="lucideGlobe" />
												<span class="min-w-0 flex flex-1 flex-col">
													<span>queue.tsx</span>
													<span class="text-muted-foreground text-xs">apps/test/app/examples</span>
												</span>
											</button>
											<button hlm-command-item value="queue-tsx-elements" class="items-start text-left">
												<ng-icon name="lucideGlobe" />
												<span class="min-w-0 flex flex-1 flex-col">
													<span>queue.tsx</span>
													<span class="text-muted-foreground text-xs">packages/elements/src</span>
												</span>
											</button>
										</hlm-command-group>
									</hlm-command-list>
								</hlm-command>
							</hlm-hover-card-content>
						</hlm-hover-card>
						<button hlmInputGroupButton variant="outline" class="rounded-[12px]" size="sm" aria-label="Attachments">
							<ng-icon name="lucidePaperclip" />
							<span>1</span>
						</button>
						<button hlmInputGroupButton variant="outline" class="rounded-[12px]" size="sm" aria-label="Tab count">
							<ng-icon name="lucideCopy" />
							<span>1 Tab</span>
						</button>
					</div>
					<textarea
						hlmInputGroupTextarea
						rows="2"
						placeholder="Plan, search, build anything"
						class="h-18 max-h-18 w-full min-w-0 field-sizing-fixed overflow-y-auto resize-none"
						(keydown)="handlePromptKeydown($event)"
					></textarea>
					<div hlmInputGroupAddon align="block-end">
						<button hlmInputGroupButton variant="ghost" class="rounded-full" size="sm">
							<ng-icon name="lucideSparkles" />
							GPT-4o
						</button>
						<span class="ml-auto"></span>
						<button hlmInputGroupButton variant="default" class="rounded-full ms-auto" size="icon-sm" aria-label="Submit prompt">
							<ng-icon name="lucideArrowUp" />
						</button>
					</div>
				</div>
			</div>
		`,
	}),
};
