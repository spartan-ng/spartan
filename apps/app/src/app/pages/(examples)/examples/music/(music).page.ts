import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCirclePlus, lucideListMusic, lucidePodcast } from '@ng-icons/lucide';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { TopMusicMenu } from './components/top-menu';

import { BrnContextMenuTrigger, BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { HlmIcon } from '@spartan-ng/helm/icon';
import {
	HlmMenu,
	HlmMenuGroup,
	HlmMenuItem,
	HlmMenuItemSubIndicator,
	HlmMenuSeparator,
	HlmSubMenu,
} from '@spartan-ng/helm/menu';

import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTabs, HlmTabsContent, HlmTabsList, HlmTabsTrigger } from '@spartan-ng/helm/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SideMusicMenu } from './components/side-menu/side-menu';
import { FallbackImage } from './directives/fallback-img';

import img from '/assets/music_img_fallback.svg';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/examples - Music', 'An music dashboard example using spartan UI primitive'),
	title: 'spartan/examples - Music',
};

@Component({
	selector: 'spartan-music-example',
	imports: [
		TopMusicMenu,
		SideMusicMenu,
		HlmTabs,
		HlmTabsList,
		HlmTabsTrigger,
		HlmTabsContent,
		HlmButton,
		NgIcon,
		HlmIcon,
		HlmSeparator,
		NgScrollbarModule,
		BrnMenuTrigger,
		BrnContextMenuTrigger,
		HlmMenu,
		HlmMenuGroup,
		HlmMenuItem,
		HlmSubMenu,
		HlmMenuItemSubIndicator,
		HlmMenuSeparator,
		HlmCard,
		FallbackImage,
	],
	providers: [provideIcons({ lucideCirclePlus, lucideListMusic, lucidePodcast })],
	host: {
		class: 'block',
	},
	styles: `
		.fallback-img {
			filter: opacity(0.3);
		}
	`,
	template: `
		<ng-template #contextMenu>
			<hlm-menu class="w-40">
				<hlm-menu-group>
					<button hlmMenuItem>Add to Library</button>
					<button hlmMenuItem [brnMenuTriggerFor]="playlist_submenu">
						Add to Playlist
						<hlm-menu-item-sub-indicator />

						<ng-template #playlist_submenu>
							<hlm-sub-menu>
								<button hlmMenuItem class="h-9">
									<ng-icon hlm size="sm" name="lucideCirclePlus" class="mr-2 h-4 w-4" />
									Add to Library
								</button>

								<hlm-menu-separator />

								@for (item of contextMenuPlaylist; track item) {
									<button hlmMenuItem class="text-left">
										<ng-icon hlm size="sm" name="lucideListMusic" class="mr-2 h-4 w-4" />
										{{ item }}
									</button>
								}
							</hlm-sub-menu>
						</ng-template>
					</button>
					<hlm-menu-separator />

					<button hlmMenuItem>Play Next</button>
					<button hlmMenuItem>Play Later</button>
					<button hlmMenuItem>Create Station</button>
					<hlm-menu-separator />

					<button hlmMenuItem>Like</button>
					<button hlmMenuItem>Share</button>
				</hlm-menu-group>
			</hlm-menu>
		</ng-template>

		<music-top-menu class="px-2 lg:px-4" />
		<div class="border-border bg-background border-t">
			<div class="grid lg:grid-cols-5">
				<music-side-menu />
				<div class="music_content col-span-3 lg:col-span-4">
					<div class="h-full px-4 py-6 lg:px-8">
						<hlm-tabs tab="music_tab" class="w-full">
							<header class="flex flex-col-reverse justify-between gap-y-10 align-baseline sm:flex-row">
								<hlm-tabs-list class="inline-grid w-full grid-cols-3 sm:w-auto">
									<button hlmTabsTrigger="music_tab">Music</button>
									<button hlmTabsTrigger="podcast_tab">Podcasts</button>
									<button
										hlmTabsTrigger="live_tab"
										[disabled]="true"
										class="pointer-events-none cursor-pointer opacity-50"
									>
										Live
									</button>
								</hlm-tabs-list>
								<button hlmBtn class="h-10 w-full sm:w-auto">
									<ng-icon hlm size="sm" class="mr-2" name="lucideCirclePlus" />
									Add Music
								</button>
							</header>

							<div hlmTabsContent="music_tab" class="w-full">
								<div class="mt-6 space-y-1">
									<h2 class="text-2xl font-semibold tracking-tight">Listen Now</h2>
									<p class="text-muted-foreground text-sm">Top picks for you. Updated daily.</p>
								</div>
								<hlm-separator />
								<div class="mt-2">
									<div class="mt-2 grid grid-cols-2 gap-4 pb-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
										@for (item of sectionData.listenNow; track item) {
											<figure class="space-y-4" [brnCtxMenuTriggerFor]="contextMenu">
												<picture class="group relative block w-full overflow-hidden rounded-md">
													<img
														[src]="item.img"
														[fallback]="imageFallback"
														class="bg-border aspect-square h-full w-full transform-gpu transition-transform group-hover:scale-110 md:aspect-[1/1.25]"
														alt="Music Image"
													/>
												</picture>
												<figcaption class="space-y-1 text-sm">
													<h3 class="leading-none font-medium">{{ item.title }}</h3>
													<p class="text-muted-foreground text-xs">{{ item.subtitle }}</p>
												</figcaption>
											</figure>
										}
									</div>
								</div>

								<div class="mt-5 space-y-1">
									<h2 class="text-2xl font-semibold tracking-tight">Made for You</h2>
									<p class="text-muted-foreground text-sm">Your personal playlists. Updated daily.</p>
								</div>

								<hlm-separator />
								<div class="mt-2 pb-4">
									<div class="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
										@for (item of sectionData.madeForYou; track item) {
											<figure class="space-y-4">
												<picture class="group relative block w-full overflow-hidden rounded-md">
													<img
														[src]="item.img"
														fallback="imageFallback"
														class="bg-border aspect-square w-full object-cover transition-transform group-hover:scale-110"
														alt="Music Image"
													/>
												</picture>
												<figcaption class="space-y-1 text-sm">
													<h3 class="leading-none font-medium">{{ item.title }}</h3>
													<p class="text-muted-foreground text-xs">{{ item.subtitle }}</p>
												</figcaption>
											</figure>
										}
									</div>
								</div>
							</div>
							<div hlmTabsContent="podcast_tab" class="w-full space-y-6">
								<div class="mt-6 space-y-2">
									<h2 class="text-2xl font-semibold tracking-tight">New Episodes</h2>
									<p class="text-muted-foreground text-sm">Your favorite podcasts. Updated daily.</p>
								</div>
								<hlm-separator />
								<div hlmCard class="flex min-h-[450px] flex-col justify-center p-6 align-middle">
									<div class="text-center">
										<ng-icon hlm size="xl" name="lucidePodcast" class="text-muted-foreground" />
										<h2 class="mt-4 text-lg font-semibold">No episodes added</h2>
										<p class="text-muted-foreground mt-2 mb-4 text-sm">
											You have not added any podcasts. Add one below
										</p>
										<button hlmBtn class="h-8 text-xs">Add Podcast</button>
									</div>
								</div>
							</div>
							<div hlmTabsContent="live_tab" class="w-full space-y-6">live</div>
						</hlm-tabs>
					</div>
				</div>
			</div>
		</div>
	`,
})
export default class MusicPage {
	public imageFallback = img;

	public sectionData = {
		listenNow: [
			{
				img: 'https://images.pexels.com/photos/16580466/pexels-photo-16580466/free-photo-of-festa-comemoracao-musica-diversao.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
				title: 'Angular Rendezvous',
				subtitle: 'Ethan Byte',
			},
			{
				img: 'https://images.pexels.com/photos/20548730/pexels-photo-20548730/free-photo-of-cidade-meio-urbano-homem-ponto-de-referencia.jpeg?auto=compress&cs=tinysrgb&w=600',
				title: 'Async Awakenings',
				subtitle: 'Nina Netcode',
			},
			{
				img: 'https://images.pexels.com/photos/20555179/pexels-photo-20555179/free-photo-of-homem-sentado-jogando-musica.jpeg?auto=compress&cs=tinysrgb&w=600',
				title: 'The Art of Reusability',
				subtitle: 'Lena Logic',
			},
			{
				img: 'https://images.pexels.com/photos/7365313/pexels-photo-7365313.jpeg?auto=compress&cs=tinysrgb&w=600',
				title: 'Stateful Symphony',
				subtitle: 'Beth Binary',
			},
		],
		madeForYou: [
			{
				img: 'https://images.pexels.com/photos/20516167/pexels-photo-20516167/free-photo-of-preto-e-branco-p-b-mulher-relaxamento.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
				title: 'Thinking Components',
				subtitle: 'Lena Logic',
			},
			{
				img: 'https://images.pexels.com/photos/4038323/pexels-photo-4038323.jpeg?auto=compress&cs=tinysrgb&w=600',
				title: 'Functional Fury',
				subtitle: 'Beth Binary',
			},
			{
				img: 'https://images.pexels.com/photos/16580466/pexels-photo-16580466/free-photo-of-festa-comemoracao-musica-diversao.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
				title: 'Angular Rendezvous',
				subtitle: 'Ethan Byte',
			},
			{
				img: 'https://images.pexels.com/photos/7365313/pexels-photo-7365313.jpeg?auto=compress&cs=tinysrgb&w=600',
				title: 'Stateful Symphony',
				subtitle: 'Beth Binary',
			},
			{
				img: 'https://images.pexels.com/photos/20548730/pexels-photo-20548730/free-photo-of-cidade-meio-urbano-homem-ponto-de-referencia.jpeg?auto=compress&cs=tinysrgb&w=600',
				title: 'Async Awakenings',
				subtitle: 'Nina Netcode',
			},
			{
				img: 'https://images.pexels.com/photos/20555179/pexels-photo-20555179/free-photo-of-homem-sentado-jogando-musica.jpeg?auto=compress&cs=tinysrgb&w=600',
				title: 'The Art of Reusability',
				subtitle: 'Lena Logic',
			},
		],
	};

	public contextMenuPlaylist = [
		'Recently Added',
		'Recently Played',
		'Top Songs',
		'Top Albums',
		'Top Artists',
		'Logic Discography',
		'Bedtime Beats',
		'Feeling Happy',
		'I Miss Y2',
		'Runtober',
		'Mellow Days',
		'Eminem Essentials',
	];
}
