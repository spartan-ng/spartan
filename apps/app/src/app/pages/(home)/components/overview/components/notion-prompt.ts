import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideArrowUp,
	lucideAtSign,
	lucideBlocks,
	lucideBookOpen,
	lucideCheck,
	lucideGlobe,
	lucidePaperclip,
	lucidePlus,
	lucideSearch,
	lucideX,
} from '@ng-icons/lucide';
import { tablerCircleDashedPlus } from '@ng-icons/tabler-icons';
import { BrnCommandEmpty } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSwitch } from '@spartan-ng/helm/switch';
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
		HlmDropdownMenuImports,
		BrnCommandEmpty,
		HlmIcon,
		NgIcon,
		MentionableItem,
		HlmBadge,
		HlmSwitch,
	],
	providers: [
		provideIcons({
			lucideAtSign,
			lucideX,
			lucidePaperclip,
			lucideCheck,
			lucideGlobe,
			lucideBlocks,
			lucideBookOpen,
			lucidePlus,
			lucideArrowUp,
			lucideSearch,
			tablerCircleDashedPlus,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'w-full' },
	template: `
		<div hlmInputGroup class="[--radius:1.2rem]">
			<div hlmInputGroupAddon align="block-start">
				<hlm-popover sideOffset="5">
					<button
						hlmInputGroupButton
						hlmPopoverTrigger
						variant="outline"
						class="rounded-full"
						[size]="_mentionButtonSize()"
					>
						<ng-icon hlm name="lucideAtSign" size="sm" />
						@if (!_hasMention()) {
							<span>Add mention</span>
						}
					</button>

					<div hlmPopoverContent class="p-0 [--radius:1.2rem]" *brnPopoverContent="let ctx">
						<hlm-command>
							<hlm-command-search>
								<ng-icon hlm name="lucideSearch" size="sm" class="shrink-0 opacity-50" />

								<input type="text" hlm-command-search-input placeholder="Type a command or search..." />
							</hlm-command-search>

							<hlm-command-list>
								@for (groupType of _groupTypes(); track groupType) {
									<hlm-command-group [id]="groupType">
										<hlm-command-group-label>{{ groupType === 'page' ? 'Pages' : 'Users' }}</hlm-command-group-label>
										@for (item of _grouped()[groupType]; track item.title) {
											<button hlm-command-item [value]="item.title" (click)="addMention(item); ctx.close()">
												<spartan-mentionable-item [item]="item" />
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
				</hlm-popover>
				<div class="no-scrollbar -m-1.5 flex gap-1 overflow-y-auto p-1.5">
					@for (mention of _mentions(); track mention) {
						<button
							hlmInputGroupButton
							variant="secondary"
							class="rounded-full"
							size="sm"
							(click)="removeMention(mention)"
						>
							<spartan-mentionable-item [item]="mention" />
							{{ mention.title }}
							<ng-icon hlm name="lucideX" size="sm" class="ml-1" />
						</button>
					}
				</div>
			</div>
			<textarea hlmInputGroupTextarea placeholder="Ask, Search or make anything..."></textarea>
			<div hlmInputGroupAddon align="block-end" class="no-scrollbar gap-1 overflow-y-auto">
				<button hlmInputGroupButton class="rounded-full" size="icon-sm">
					<ng-icon hlm name="lucidePaperclip" size="sm" />
					<span class="sr-only">Attachment</span>
				</button>
				<button hlmInputGroupButton class="rounded-full" size="sm" [hlmDropdownMenuTrigger]="model" #menuTrigger>
					{{ _selectedModel() ? _selectedModel()?.name : 'Agent Mode' }}
				</button>
				<ng-template #model>
					<hlm-dropdown-menu class="w-50 [--radius:1rem]">
						<hlm-dropdown-menu-group>
							<hlm-dropdown-menu-label class="text-muted-foreground text-xs">Select Agent Mode</hlm-dropdown-menu-label>
							@for (model of _models; track model.name) {
								<button hlmDropdownMenuCheckbox [checked]="isChecked(model)" (click)="selectModel(model)">
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
									<hlm-dropdown-menu-checkbox-indicator />
								</button>
							}
						</hlm-dropdown-menu-group>
					</hlm-dropdown-menu>
				</ng-template>

				<button hlmInputGroupButton class="rounded-full" size="sm" [hlmDropdownMenuTrigger]="sources">
					<ng-icon hlm name="lucideGlobe" size="sm" />
					All Sources
				</button>
				<ng-template #sources>
					<hlm-dropdown-menu class="w-75 [--radius:1rem]">
						<hlm-dropdown-menu-group>
							<button hlmDropdownMenuItem (click)="$event.stopPropagation()">
								<label for="web-search" (click)="$event.stopPropagation()" class="flex flex-1 items-center">
									<ng-icon hlm name="lucideGlobe" class="mr-2" size="sm" />
									Web Search
									<hlm-switch id="web-search" class="ml-auto" [checked]="true" (click)="$event.stopPropagation()" />
								</label>
							</button>
						</hlm-dropdown-menu-group>
						<hlm-dropdown-menu-separator />
						<hlm-dropdown-menu-group>
							<button hlmDropdownMenuItem (click)="$event.stopPropagation()">
								<label for="app-integrations" class="flex flex-1" (click)="$event.stopPropagation()">
									<ng-icon hlm name="lucideBlocks" class="mr-2" size="sm" />
									Apps and Integrations
									<hlm-switch
										id="app-integrations"
										class="ml-auto"
										[checked]="true"
										(click)="$event.stopPropagation()"
									/>
								</label>
							</button>
							<button hlmDropdownMenuItem>
								<ng-icon hlm name="tablerCircleDashedPlus" size="sm" />
								All Sources I can access
							</button>
							<button hlmDropdownMenuItem>
								<ng-icon hlm name="lucideBookOpen" size="sm" />
								Help Center
							</button>
						</hlm-dropdown-menu-group>
						<hlm-dropdown-menu-separator />
						<hlm-dropdown-menu-group>
							<button hlmDropdownMenuItem>
								<ng-icon hlm name="lucidePlus" size="sm" />
								Connect Apps
							</button>
							<hlm-dropdown-menu-label class="text-muted-foreground text-xs">
								We&apos;ll only search in the sources selected here.
							</hlm-dropdown-menu-label>
						</hlm-dropdown-menu-group>
					</hlm-dropdown-menu>
				</ng-template>

				<button hlmInputGroupButton variant="default" class="ml-auto rounded-full" size="icon-sm">
					<ng-icon hlm name="lucideArrowUp" size="sm" />
					<span class="sr-only">Send</span>
				</button>
			</div>
		</div>
	`,
})
export class NotionPrompt {
	protected _models = SAMPLE_DATA.models;
	protected _mentions = signal<MentionItem[]>([]);
	protected _selectedModel = signal<ModelItem | undefined>(this._models[0]);

	protected _hasMention = computed(() => this._mentions().length > 0);
	protected _mentionButtonSize = computed(() => (this._hasMention() ? 'icon-sm' : 'sm'));

	protected _grouped = computed(() => {
		return SAMPLE_DATA.mentionable.reduce(
			(acc, item) => {
				const isAvailable = !this._mentions()
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
	protected _groupTypes = computed(() => Object.keys(this._grouped()));

	addMention(item: MentionItem) {
		this._mentions.update((mentions) => [...mentions, item]);
	}

	removeMention(item: MentionItem) {
		this._mentions.update((mentions) => mentions.filter((mention) => mention.title !== item.title));
	}

	selectModel(model: ModelItem) {
		this._selectedModel.set(model);
	}

	isChecked(model: ModelItem) {
		return this._selectedModel() === model;
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
