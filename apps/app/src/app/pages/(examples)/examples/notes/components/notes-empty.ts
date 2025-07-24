import { Component } from '@angular/core';
import { HlmCard, HlmCardContent, HlmCardDescription, HlmCardTitle } from '@spartan-ng/helm/card';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'analog-trpc-notes-empty',
	host: {
		class: 'block',
	},
	hostDirectives: [
		{
			directive: HlmCard,
			inputs: ['class'],
		},
	],
	imports: [HlmCardContent, HlmCardDescription, HlmCardTitle],
	template: `
		<div hlmCardContent class="flex h-52 flex-col items-center justify-center">
			<h3 hlmCardTitle>No notes yet!</h3>
			<p hlmCardDescription>Add a new one and see them appear here...</p>
		</div>
	`,
})
export class NotesEmpty {}
