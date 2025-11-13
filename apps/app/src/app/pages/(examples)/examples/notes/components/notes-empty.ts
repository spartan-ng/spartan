import { Component } from '@angular/core';
import { HlmCard, HlmCardContent, HlmCardDescription, HlmCardTitle } from '@spartan-ng/helm/card';

@Component({
	selector: 'spartan-analog-trpc-notes-empty',
	imports: [HlmCardContent, HlmCardDescription, HlmCardTitle],
	hostDirectives: [
		{
			directive: HlmCard,
			inputs: ['class'],
		},
	],
	host: {
		class: 'block',
	},
	template: `
		<div hlmCardContent class="flex h-52 flex-col items-center justify-center">
			<h3 hlmCardTitle>No notes yet!</h3>
			<p hlmCardDescription>Add a new one and see them appear here...</p>
		</div>
	`,
})
export class NotesEmpty {}
