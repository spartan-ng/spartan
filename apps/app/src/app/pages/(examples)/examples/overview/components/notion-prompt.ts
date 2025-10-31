import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAtSign, lucideCheck, lucidePaperclip, lucideX } from '@ng-icons/lucide';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { MentionableItem } from './mentionable-item';

export type MentionItem = {
	type: string;
	title: string;
	image: string;
	workspace?: string;
};

type ModelItem = {
	name: string;
	badge?: string;
};

type GroupedItems = {
	mentionable: MentionItem[];
	models: ModelItem[];
};
@Component({
	selector: 'spartan-notion-prompt',
	imports: [
		HlmInputGroupImports,
		BrnPopoverImports,
		HlmPopoverImports,
		HlmCommandImports,
		HlmAvatarImports,
		HlmMenuImports,
		BrnMenuImports,
		HlmSeparator,
		HlmIcon,
		NgIcon,
		MentionableItem,
		HlmBadge,
	],
	providers: [provideIcons({ lucideAtSign, lucideX, lucidePaperclip, lucideCheck })],
	host: { class: 'w-full' },
	template: `
		<div hlmInputGroup>
			<div hlmInputGroupAddon align="block-start">
				<brn-popover sideOffset="5">
					<button
						hlmInputGroupButton
						brnPopoverTrigger
						variant="outline"
						class="rounded-full"
						[size]="mentionButtonSize()"
					>
						<ng-icon hlm name="lucideAtSign" />
						@if (!hasMention()) {
							<span>Add mention</span>
						}
					</button>

					<div hlmPopoverContent class="p-0 [--radius:1.2rem]" *brnPopoverContent="let ctx">
						<hlm-command>
							<hlm-command-search>
								<ng-icon hlm name="lucideSearch" class="shrink-0 opacity-50" />

								<input type="text" hlm-command-search-input placeholder="Type a command or search..." />
							</hlm-command-search>

							<hlm-command-list>
								@for (groupType of groupTypes(); track groupType) {
									<hlm-command-group [id]="groupType">
										<hlm-command-group-label>{{ groupType === 'page' ? 'Pages' : 'Users' }}</hlm-command-group-label>
										@for (item of grouped()[groupType]; track item.title) {
											<button hlm-command-item [value]="item.title" (click)="addMention(item)">
												<mentionable-item [item]="item" />
												{{ item.title }}
											</button>
										}
									</hlm-command-group>
								}
							</hlm-command-list>

							<!-- Empty state -->
							<div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
						</hlm-command>
					</div>
				</brn-popover>
				<div class="no-scrollbar -m-1.5 flex gap-1 overflow-y-auto p-1.5">
					@for (mention of mentions(); track mention) {
						<button
							hlmInputGroupButton
							variant="secondary"
							class="rounded-full"
							size="sm"
							(click)="removeMention(mention)"
						>
							<mentionable-item [item]="mention" />
							{{ mention.title }}
							<ng-icon hlm name="lucideX" class="ml-1" />
						</button>
					}
				</div>
			</div>
			<textarea hlmInputGroupTextarea placeholder="Ask, Search or Chat..."></textarea>
			<div hlmInputGroupAddon align="block-end">
				<button hlmInputGroupButton variant="secondary" class="rounded-full" size="icon-sm">
					<ng-icon hlm name="lucidePaperclip" />
				</button>
				<button hlmInputGroupButton class="rounded-full" size="sm" [brnMenuTriggerFor]="model">
					{{ selectedModel() ? selectedModel()?.name : 'Agent Mode' }}
				</button>
				<ng-template #model>
					<hlm-menu class="w-42">
						<hlm-menu-group>
							<hlm-menu-label class="text-muted-foreground text-xs">Select Agent Mode</hlm-menu-label>
							@for (model of models; track model.name) {
								<button
									hlmMenuItemCheckbox
									[checked]="isChecked(model)"
									(click)="selectModel(model)"
									class="pl-2 *:[span:first-child]:right-2 *:[span:first-child]:left-auto"
								>
									<span>{{ model.name }}</span>
									@if (model.badge) {
										<span
											hlmBadge
											variant="secondary"
											class="ml-2 h-5 rounded-sm bg-blue-100 px-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-100"
										>
											{{ model.badge }}
										</span>
									}
								</button>
							}
						</hlm-menu-group>
					</hlm-menu>
				</ng-template>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotionPrompt {
	models = SAMPLE_DATA.models;
	mentions = signal<MentionItem[]>([]);
	selectedModel = signal<ModelItem | undefined>(this.models[0]);

	hasMention = computed(() => this.mentions().length > 0);
	mentionButtonSize = computed(() => (this.hasMention() ? 'icon-sm' : 'sm'));

	grouped = computed(() => {
		return SAMPLE_DATA.mentionable.reduce(
			(acc, item) => {
				const isAvailable = !this.mentions()
					.map((mention) => mention.title)
					.includes(item?.title);

				if (isAvailable) {
					if (!acc[item.type]) {
						acc[item.type] = [];
					}
					acc[item.type].push(item);
				}
				return acc;
			},
			{} as Record<string, typeof SAMPLE_DATA.mentionable>,
		);
	});
	groupTypes = computed(() => Object.keys(this.grouped()));

	addMention(item: MentionItem) {
		this.mentions.update((mentions) => [...mentions, item]);
	}

	removeMention(item: MentionItem) {
		this.mentions.update((mentions) => mentions.filter((mention) => mention.title !== item.title));
	}

	selectModel(model: ModelItem) {
		this.selectedModel.set(model);
	}

	isChecked(model: ModelItem) {
		return this.selectedModel() === model;
	}
}

const SAMPLE_DATA: GroupedItems = {
	mentionable: [
		{
			type: 'page',
			title: 'Meeting Notes',
			image: '📝',
		},
		{
			type: 'page',
			title: 'Project Dashboard',
			image: '📊',
		},
		{
			type: 'page',
			title: 'Ideas & Brainstorming',
			image: '💡',
		},
		{
			type: 'page',
			title: 'Calendar & Events',
			image: '📅',
		},
		{
			type: 'page',
			title: 'Documentation',
			image: '📚',
		},
		{
			type: 'page',
			title: 'Goals & Objectives',
			image: '🎯',
		},
		{
			type: 'page',
			title: 'Budget Planning',
			image: '💰',
		},
		{
			type: 'page',
			title: 'Team Directory',
			image: '👥',
		},
		{
			type: 'page',
			title: 'Technical Specs',
			image: '🔧',
		},
		{
			type: 'page',
			title: 'Analytics Report',
			image: '📈',
		},
		{
			type: 'user',
			title: 'shadcn',
			image: 'https://github.com/shadcn.png',
			workspace: 'Workspace',
		},
		{
			type: 'user',
			title: 'maxleiter',
			image: 'https://github.com/maxleiter.png',
			workspace: 'Workspace',
		},
		{
			type: 'user',
			title: 'evilrabbit',
			image: 'https://github.com/evilrabbit.png',
			workspace: 'Workspace',
		},
	],
	models: [
		{
			name: 'Auto',
		},
		{
			name: 'Agent Mode',
			badge: 'Beta',
		},
		{
			name: 'Plan Mode',
		},
	],
};
