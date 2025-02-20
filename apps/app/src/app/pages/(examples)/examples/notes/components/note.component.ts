import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Note } from '@spartan-ng/app/db';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
	HlmCardContentDirective,
	HlmCardDescriptionDirective,
	HlmCardDirective,
	HlmCardFooterDirective,
	HlmCardHeaderDirective,
	HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmSpinnerComponent } from '@spartan-ng/ui-spinner-helm';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'analog-trpc-note',
	hostDirectives: [HlmCardDirective],
	host: {
		class: 'block',
	},
	imports: [
		DatePipe,
		HlmButtonDirective,
		HlmCardContentDirective,
		HlmCardDescriptionDirective,
		HlmCardDirective,
		HlmCardFooterDirective,
		HlmCardHeaderDirective,
		HlmCardTitleDirective,
		HlmSpinnerComponent,
		NgForOf,
		NgIf,
		RouterLink,
		HlmBadgeDirective,
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
				class="absolute right-2 top-2"
				hlmBtn
				size="sm"
				variant="ghost"
				(click)="deleteClicked.emit()"
			>
				<hlm-spinner *ngIf="deletionInProgress" size="xs" />
				<span class="sr-only">Delete note with title: {{ note.title }}</span>
				<svg
					*ngIf="!deletionInProgress"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-4 w-4"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
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
export class NoteComponent {
	@Input() public deletionInProgress = false;
	@Input({ required: true }) public note!: Note;
	@Output() public readonly deleteClicked = new EventEmitter<void>();
}
