import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';

@Component({
	selector: 'spartan-toggle-group-preview',
	imports: [HlmToggleGroupImports, NgIcon],
	providers: [provideIcons({ lucideBold, lucideItalic, lucideUnderline })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hlm-toggle-group type="multiple" variant="outline">
			<button hlmToggleGroupItem value="bold" aria-label="Toggle bold">
				<ng-icon name="lucideBold" />
			</button>
			<button hlmToggleGroupItem value="italic" aria-label="Toggle italic">
				<ng-icon name="lucideItalic" />
			</button>
			<button hlmToggleGroupItem value="underline" aria-label="Toggle underline">
				<ng-icon name="lucideUnderline" />
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
