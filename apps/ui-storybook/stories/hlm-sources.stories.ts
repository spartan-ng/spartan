import { HlmSourcesImports } from '@spartan-ng/helm/sources';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta = {
	title: 'AI Elements/Sources',
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmSourcesImports],
		}),
	],
};

export default meta;
type Story = StoryObj;

const SOURCES = [
	{ href: 'https://ai-sdk.dev', title: 'https://ai-sdk.dev' },
	{ href: 'https://angular.dev', title: 'https://angular.dev' },
	{ href: 'https://elements.ai-sdk.dev/components/sources', title: 'https://elements.ai-sdk.dev/components/sources' },
];

/**
 * `hlmSources` composes `brnCollapsible` so a response's citations can be tucked away behind a
 * "Used N sources" trigger and expanded on demand, mirroring the AI Elements `Sources` component.
 * `hlmSourcesTrigger`'s `count` input drives the default label, and `hlmSource` renders a book icon
 * with the link's title unless custom content is provided.
 */
export const Default: Story = {
	render: () => ({
		props: { sources: SOURCES },
		template: `
			<div class="max-w-lg p-4">
				<div hlmSources>
					<button hlmSourcesTrigger [count]="sources.length"></button>
					<div hlmSourcesContent>
						@for (source of sources; track source.href) {
							<a hlmSource [href]="source.href" [title]="source.title"></a>
						}
					</div>
				</div>
			</div>
		`,
	}),
};
