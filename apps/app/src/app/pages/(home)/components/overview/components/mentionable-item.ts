import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { MentionItem } from './notion-prompt';

@Component({
	selector: 'spartan-mentionable-item',
	imports: [HlmAvatarImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (item().type === 'user') {
			<hlm-avatar class="size-4">
				<img hlmAvatarImage [alt]="item().title" [src]="item().image" />
				<span hlmAvatarFallback>{{ item().title }}</span>
			</hlm-avatar>
		} @else if (item().type === 'page') {
			<span class="flex size-4 items-center justify-center">
				{{ item().image }}
			</span>
		}
	`,
})
export class MentionableItem {
	public item = input.required<MentionItem>();
}
