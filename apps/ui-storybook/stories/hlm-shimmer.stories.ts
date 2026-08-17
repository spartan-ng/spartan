import { HlmShimmerImports } from '@spartan-ng/helm/shimmer';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

const meta: Meta = {
	title: 'AI Elements/Shimmer',
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmShimmerImports],
		}),
	],
};

export default meta;
type Story = StoryObj;

/**
 * `hlmShimmer` is a plain attribute directive - unlike React AI Elements' `<Shimmer as="...">`,
 * it already works on any host tag with no extra prop, so applying it to a large/bold `<h1>`
 * next to normal body text needs nothing special. It also shows the shimmer band scaling
 * automatically with the text's own font size (wider on the `<h1>` than the `<p>`). Both use the
 * directive's default 2s duration - `leading-tight` on the `<h1>` avoids clipping descenders
 * (e.g. the "g" in "Loading"), since `text-6xl`'s default line-height is a tight 1.
 */
export const Default: Story = {
	render: () => ({
		template: `
			<div class="flex flex-col gap-6 p-4">
				<h1 hlmShimmer class="text-6xl leading-tight font-extrabold tracking-tight">Loading</h1>
				<p hlmShimmer class="text-lg">Generating response...</p>
			</div>
		`,
	}),
};
