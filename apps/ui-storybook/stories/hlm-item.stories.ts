import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideBadgeCheck,
	lucideChevronDown,
	lucideChevronRight,
	lucideExternalLink,
	lucidePlus,
	lucideShieldAlert,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmItem, HlmItemImports } from '@spartan-ng/helm/item';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

export default {
	title: 'Item',
	component: HlmItem,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmItemImports, HlmButtonImports, NgIcon, HlmAvatarImports, HlmDropdownMenuImports],
			providers: [
				provideIcons({
					lucideBadgeCheck,
					lucideChevronRight,
					lucidePlus,
					lucideChevronDown,
					lucideShieldAlert,
					lucideExternalLink,
				}),
			],
		}),
	],
} as Meta<HlmItem>;

type Story = StoryObj<HlmItem>;

export const Default: Story = {
	render: () => ({
		template: `
		<div class="flex w-full max-w-md flex-col gap-6 p-4">
			<hlm-item variant="outline">
				<hlm-item-content>
					<hlm-item-title>Basic Item</hlm-item-title>
					<p hlmItemDescription>A simple item with title and description.</p>
				</hlm-item-content>
				<hlm-item-actions>
					<button hlmBtn variant="outline" size="sm">Action</button>
				</hlm-item-actions>
			</hlm-item>
			<a hlmItem variant="outline" size="sm">
				<hlm-item-media>
					<ng-icon name="lucideBadgeCheck" class="text-[calc(var(--spacing)*5)]" />
				</hlm-item-media>
				<hlm-item-content>
					<hlm-item-title>Your profile has been verified.</hlm-item-title>
				</hlm-item-content>
				<div hlmItemActions>
					<ng-icon name="lucideChevronRight"  />
				</div>
			</a>
		</div>
		`,
	}),
};

export const Avatar: Story = {
	render: () => ({
		template: `
		<div class="flex w-full max-w-lg flex-col gap-6 p-4">
			<!-- Item 1: Evil Rabbit -->
			<hlm-item variant="outline">
				<hlm-item-media>
					<hlm-avatar class="size-10">
						<img hlmAvatarImage src="https://github.com/evilrabbit.png" alt="Evil Rabbit" />
						<span hlmAvatarFallback>ER</span>
					</hlm-avatar>
				</hlm-item-media>
				<hlm-item-content>
					<hlm-item-title>Evil Rabbit</hlm-item-title>
					<p hlmItemDescription>Last seen 5 months ago</p>
				</hlm-item-content>
				<hlm-item-actions>
					<button hlmBtn size="icon-sm" variant="ghost" class="rounded-full" aria-label="Invite">
						<ng-icon name="lucidePlus" />
					</button>
				</hlm-item-actions>
			</hlm-item>

			<!-- Item 2: No Team Members -->
			<hlm-item variant="outline">
				<hlm-item-media>
					<div
						class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale"
					>
						<hlm-avatar class="hidden sm:flex">
							<img hlmAvatarImage src="https://github.com/spartan-ng.png" alt="@spartan-ng" />
							<span hlmAvatarFallback>CN</span>
						</hlm-avatar>
						<hlm-avatar class="hidden sm:flex">
							<img hlmAvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
							<span hlmAvatarFallback>LR</span>
						</hlm-avatar>
						<hlm-avatar>
							<img hlmAvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
							<span hlmAvatarFallback>ER</span>
						</hlm-avatar>
					</div>
				</hlm-item-media>
				<hlm-item-content>
					<hlm-item-title>No Team Members</hlm-item-title>
					<p hlmItemDescription>Invite your team to collaborate on this project.</p>
				</hlm-item-content>
				<hlm-item-actions>
					<button hlmBtn size="sm" variant="outline">Invite</button>
				</hlm-item-actions>
			</hlm-item>
		</div>
		`,
	}),
};

export const Dropdown: Story = {
	render: () => ({
		props: {
			people: [
				{
					username: 'spartan-ng',
					avatar: 'https://github.com/spartan-ng.png',
					email: 'spartan@ng.com',
				},
				{
					username: 'maxleiter',
					avatar: 'https://github.com/maxleiter.png',
					email: 'maxleiter@vercel.com',
				},
				{
					username: 'evilrabbit',
					avatar: 'https://github.com/evilrabbit.png',
					email: 'evilrabbit@vercel.com',
				},
			],
		},
		template: `
		<div class="flex min-h-64 w-full max-w-md flex-col items-center gap-6 p-4">
			<button hlmBtn variant="outline" size="sm" [hlmDropdownMenuTrigger]="peopleTemplate" class="w-fit" align="end">
				Select
				<ng-icon name="lucideChevronDown" />
			</button>

			<ng-template #peopleTemplate>
				<hlm-dropdown-menu class="w-48">
					@for (person of people; track person.email) {
						<button hlmDropdownMenuItem class="p-0 w-full">
							<hlm-item size="xs" class="w-full p-2">
								<hlm-item-media>
									<hlm-avatar class="size-8">
										<img hlmAvatarImage [src]="person.avatar" [alt]="person.username" class="grayscale" />
										<span hlmAvatarFallback>
											{{ person.username.charAt(0).toUpperCase() }}
										</span>
									</hlm-avatar>
								</hlm-item-media>
								<hlm-item-content class="gap-0">
									<span hlmItemTitle>{{ person.username }}</span>
									<span hlmItemDescription>{{ person.email }}</span>
								</hlm-item-content>
							</hlm-item>
						</button>
					}
				</hlm-dropdown-menu>
			</ng-template>
		</div>
		`,
	}),
};

export const Group: Story = {
	render: () => ({
		props: {
			people: [
				{
					username: 'spartan-ng',
					avatar: 'https://github.com/spartan-ng.png',
					email: 'spartan@ng.com',
				},
				{
					username: 'maxleiter',
					avatar: 'https://github.com/maxleiter.png',
					email: 'maxleiter@vercel.com',
				},
				{
					username: 'evilrabbit',
					avatar: 'https://github.com/evilrabbit.png',
					email: 'evilrabbit@vercel.com',
				},
			],
		},
		template: `
		<div class="flex w-full max-w-md flex-col gap-6 p-4">
			<hlm-item-group>
				@for (person of people; track person.username; let last = $last) {
					<hlm-item variant="outline">
						<hlm-item-media>
							<hlm-avatar>
								<img hlmAvatarImage [src]="person.avatar" [alt]="person.username" class="grayscale" />
								<span hlmAvatarFallback>{{ person.username.charAt(0).toUpperCase() }}</span>
							</hlm-avatar>
						</hlm-item-media>

						<hlm-item-content class="gap-1">
							<hlm-item-title>{{ person.username }}</hlm-item-title>
							<p hlmItemDescription>{{ person.email }}</p>
						</hlm-item-content>

						<hlm-item-actions>
							<button hlmBtn variant="ghost" size="icon" class="rounded-full" aria-label="Add person">
								<ng-icon name="lucidePlus" />
							</button>
						</hlm-item-actions>
					</hlm-item>
				}
			</hlm-item-group>
		</div>
		`,
	}),
};

export const Header: Story = {
	render: () => ({
		props: {
			models: [
				{
					name: 'v0-1.5-sm',
					description: 'Everyday tasks and UI generation.',
					image: 'https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop',
				},
				{
					name: 'v0-1.5-lg',
					description: 'Advanced thinking or reasoning.',
					image: 'https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop',
				},
				{
					name: 'v0-2.0-mini',
					description: 'Open Source model for everyone.',
					image: 'https://images.unsplash.com/photo-1602146057681-08560aee8cde?q=80&w=640&auto=format&fit=crop',
				},
			],
		},
		template: `
		<div class="flex w-full max-w-xl flex-col gap-6 p-4">
			<hlm-item-group class="grid grid-cols-3 gap-4">
				@for (model of models; track model.name) {
					<hlm-item variant="outline">
						<hlm-item-header>
							<img
								[src]="model.image"
								[alt]="model.name"
								width="128"
								height="128"
								class="aspect-square w-full rounded-sm object-cover"
							/>
						</hlm-item-header>
						<hlm-item-content>
							<hlm-item-title>{{ model.name }}</hlm-item-title>
							<p hlmItemDescription>{{ model.description }}</p>
						</hlm-item-content>
					</hlm-item>
				}
			</hlm-item-group>
		</div>
		`,
	}),
};

export const Icon: Story = {
	render: () => ({
		template: `
		<div class="flex w-full max-w-lg flex-col gap-6 p-4">
			<div hlmItem variant="outline">
				<div hlmItemMedia variant="icon">
					<ng-icon name="lucideShieldAlert" />
				</div>
				<div hlmItemContent>
					<div hlmItemTitle>Security Alert</div>
					<p hlmItemDescription>New login detected from unknown device.</p>
				</div>
				<div hlmItemActions>
					<button hlmBtn size="sm" variant="outline">Review</button>
				</div>
			</div>
		</div>
		`,
	}),
};

export const Image: Story = {
	render: () => ({
		props: {
			songs: [
				{
					title: 'Midnight City Lights',
					artist: 'Neon Dreams',
					album: 'Electric Nights',
					duration: '3:45',
				},
				{
					title: 'Coffee Shop Conversations',
					artist: 'The Morning Brew',
					album: 'Urban Stories',
					duration: '4:05',
				},
				{
					title: 'Digital Rain',
					artist: 'Cyber Symphony',
					album: 'Binary Beats',
					duration: '3:30',
				},
			],
		},
		template: `
		<div class="flex w-full max-w-md flex-col gap-6 p-4">
			<div hlmItemGroup class="gap-4" role="list">
				@for (song of songs; track song.title) {
					<a hlmItem variant="outline" role="listitem" href="#">
						<div hlmItemMedia variant="image">
							<img
								[src]="'https://avatar.vercel.sh/' + song.title"
								alt=""
								width="32"
								height="32"
								class="object-cover grayscale"
							/>
						</div>

						<div hlmItemContent>
							<div hlmItemTitle class="line-clamp-1">
								{{ song.title }} -
								<span class="text-muted-foreground">{{ song.album }}</span>
							</div>
							<p hlmItemDescription>{{ song.artist }}</p>
						</div>

						<div hlmItemContent class="flex-none text-center">
							<p hlmItemDescription>{{ song.duration }}</p>
						</div>
					</a>
				}
			</div>
		</div>
		`,
	}),
};

export const Link: Story = {
	render: () => ({
		template: `
		<div class="flex w-full max-w-md flex-col gap-6 p-4">
			<a hlmItem href="#">
				<div hlmItemContent>
					<div hlmItemTitle>Visit our documentation</div>
					<p hlmItemDescription>Learn how to get started with our components.</p>
				</div>
				<div hlmItemActions>
					<ng-icon hlm name="lucideChevronRight" size="sm" />
				</div>
			</a>
			<a hlmItem variant="outline" href="#" target="_blank" rel="noopener noreferrer">
				<div hlmItemContent>
					<div hlmItemTitle>External resource</div>
					<p hlmItemDescription>Opens in a new tab with security attributes.</p>
				</div>
				<div hlmItemActions>
					<ng-icon hlm name="lucideExternalLink" size="sm" />
				</div>
			</a>
		</div>
		`,
	}),
};

export const Size: Story = {
	render: () => ({
		template: `
		<div class="flex w-full max-w-md flex-col gap-6 p-4">
			<div hlmItem variant="outline">
				<div hlmItemContent>
					<div hlmItemTitle>Basic Item</div>
					<p hlmItemDescription>A simple item with title and description.</p>
				</div>
				<div hlmItemActions>
					<button hlmBtn variant="outline" size="sm">Action</button>
				</div>
			</div>
			<a hlmItem variant="outline" size="sm" href="#">
				<div hlmItemMedia>
					<ng-icon hlm name="lucideBadgeCheck" size="20px" />
				</div>
				<div hlmItemContent>
					<div hlmItemTitle>Your profile has been verified.</div>
				</div>
				<div hlmItemActions>
					<ng-icon hlm name="lucideChevronRight" size="sm" />
				</div>
			</a>
		</div>
		`,
	}),
};

export const Variants: Story = {
	render: () => ({
		template: `
		<div class="flex w-full max-w-md flex-col gap-6 p-4">
			<div hlmItem>
				<div hlmItemContent>
					<div hlmItemTitle>Default Variant</div>
					<p hlmItemDescription>Standard styling with subtle background and borders.</p>
				</div>
				<div hlmItemActions>
					<button hlmBtn variant="outline" size="sm">Open</button>
				</div>
			</div>
			<div hlmItem variant="outline">
				<div hlmItemContent>
					<div hlmItemTitle>Outline Variant</div>
					<p hlmItemDescription>Outlined style with clear borders and transparent background.</p>
				</div>
				<div hlmItemActions>
					<button hlmBtn variant="outline" size="sm">Open</button>
				</div>
			</div>
			<div hlmItem variant="muted">
				<div hlmItemContent>
					<div hlmItemTitle>Muted Variant</div>
					<p hlmItemDescription>Subdued appearance with muted colors for secondary content.</p>
				</div>
				<div hlmItemActions>
					<button hlmBtn variant="outline" size="sm">Open</button>
				</div>
			</div>
		</div>
		`,
	}),
};
