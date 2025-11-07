import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookmark, lucideHeart, lucideStar } from '@ng-icons/lucide';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';

@Component({
	selector: 'spartan-toggle-group-preview',
	imports: [HlmToggleGroupImports, NgIcon],
	providers: [provideIcons({ lucideStar, lucideHeart, lucideBookmark })],
	template: `
		<hlm-toggle-group type="multiple" variant="outline" spacing="2" size="sm">
			<button
				hlmToggleGroupItem
				value="star"
				aria-label="Toggle star"
				class="data-[state=on]:bg-transparent data-[state=on]:*:[ng-icon]:*:[svg]:fill-yellow-500 data-[state=on]:*:[ng-icon]:*:[svg]:stroke-yellow-500"
			>
				<ng-icon name="lucideStar" />
				Star
			</button>
			<button
				hlmToggleGroupItem
				value="heart"
				aria-label="Toggle heart"
				class="data-[state=on]:bg-transparent data-[state=on]:*:[ng-icon]:*:[svg]:fill-red-500 data-[state=on]:*:[ng-icon]:*:[svg]:stroke-red-500"
			>
				<ng-icon name="lucideHeart" />
				Heart
			</button>
			<button
				hlmToggleGroupItem
				value="bookmark"
				aria-label="Toggle bookmark"
				class="data-[state=on]:bg-transparent data-[state=on]:*:[ng-icon]:*:[svg]:fill-blue-500 data-[state=on]:*:[ng-icon]:*:[svg]:stroke-blue-500"
			>
				<ng-icon name="lucideBookmark" />
				Bookmark
			</button>
		</hlm-toggle-group>
	`,
})
export class ToggleGroupPreview {}

export const defaultImports = `
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
`;

export const defaultSkeleton = `
<hlm-toggle-group type="single">
	<button hlmToggleGroupItem value="a">A</button>
	<button hlmToggleGroupItem value="b">B</button>
	<button hlmToggleGroupItem value="c">C</button>
</hlm-toggle-group>
`;
