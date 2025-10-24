import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Note } from '@spartan-ng/app/db';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import {
	HlmCard,
	HlmCardContent,
	HlmCardDescription,
	HlmCardFooter,
	HlmCardHeader,
	HlmCardTitle,
} from '@spartan-ng/helm/card';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'analog-trpc-note',
	hostDirectives: [HlmCard],
	host: {
		class: 'block',
	},
	imports: [
		DatePipe,
		HlmButton,
		HlmCardContent,
		HlmCardDescription,
		HlmCardFooter,
		HlmCardHeader,
		HlmCardTitle,
		HlmSpinner,
		RouterLink,
		HlmBadge,
	],
	template: `
		<div hlmCardHeader class="relative">
			<h3 hlmCardTitle>{{ note.title }}</h3>
			<p hlmCardDescription>
				Created at:
				<span hlmBadge variant="secondary" class="px-2">{{ note.createdAt | date }}</span>
			</p>
			<button
				[disabled]="deletionInProgress"
				class="absolute top-2 right-2"
				hlmBtn
				size="sm"
				variant="ghost"
				(click)="deleteClicked.emit()"
			>
				@if (deletionInProgress) {
					<hlm-spinner size="xs" />
				}
				<span class="sr-only">Delete note with title: {{ note.title }}</span>
				@if (!deletionInProgress) {
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-4 w-4"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				}
			</button>
		</div>
		<p hlmCardContent>
			{{ note.content }}
		</p>
		<div hlmCardFooter class="justify-end">
			<a routerLink="/" hlmBtn variant="link">Read more</a>
		</div>
	`,
})
export class NoteCard {
	@Input() public deletionInProgress = false;
	@Input({ required: true }) public note!: Note;
	@Output() public readonly deleteClicked = new EventEmitter<void>();
}
