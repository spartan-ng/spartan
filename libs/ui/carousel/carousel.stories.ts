import { argsToTemplate, Meta, moduleMetadata, StoryObj } from '@storybook/angular';

import Autoplay from 'embla-carousel-autoplay';
import { HlmCardContentDirective, HlmCardDirective } from '../card/helm/src';
import { HlmCarouselComponent, HlmCarouselImports } from './helm/src';

const meta: Meta<HlmCarouselComponent> = {
	title: 'Carousel',
	component: HlmCarouselComponent,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmCarouselImports, HlmCardDirective, HlmCardContentDirective],
		}),
	],
};

export default meta;
type Story = StoryObj<HlmCarouselComponent>;

export const Default: Story = {
	render: () => ({
		template: `
    <div class="flex items-center justify-center w-full p-4">
      <hlm-carousel class="w-full max-w-xs">
        <hlm-carousel-content>
        ${Array.from(
					{ length: 5 },
					(_, i) => `
        <hlm-carousel-item>
          <div class="p-1">
            <section hlmCard>
              <p hlmCardContent class="flex items-center justify-center p-6 aspect-square">
                <span class="text-4xl font-semibold">${i + 1}</span>
              </p>
            </section>
          </div>
        </hlm-carousel-item>
        `,
				).join('\n')}
        </hlm-carousel-content>
        <button hlm-carousel-previous></button>
        <button hlm-carousel-next></button>
      </hlm-carousel>
    </div>
    `,
	}),
};

export const Sizes: Story = {
	render: () => ({
		template: `
    <div class="flex items-center justify-center w-full p-4">
      <hlm-carousel class="w-full max-w-xs">
        <hlm-carousel-content>
					${Array.from(
						{ length: 5 },
						(_, i) => `
					<hlm-carousel-item class="md:basis-1/2 lg:basis-1/3">
						<div class="p-1">
							<section hlmCard>
								<p hlmCardContent class="flex items-center justify-center p-6 aspect-square">
									<span class="text-4xl font-semibold">${i + 1}</span>
								</p>
							</section>
						</div>
					</hlm-carousel-item>
					`,
					).join('\n')}
        </hlm-carousel-content>
        <button hlm-carousel-previous></button>
        <button hlm-carousel-next></button>
      </hlm-carousel>
    </div>
    `,
	}),
};

export const Spacing: Story = {
	render: () => ({
		template: `
    <div class="flex items-center justify-center w-full p-4">
      <hlm-carousel class="w-full max-w-xs">
        <hlm-carousel-content class="-ml-1">
					${Array.from(
						{ length: 5 },
						(_, i) => `
					<hlm-carousel-item class="pl-1 md:basis-1/2 lg:basis-1/3">
						<div class="p-1">
							<section hlmCard>
								<p hlmCardContent class="flex items-center justify-center p-6 aspect-square">
									<span class="text-4xl font-semibold">${i + 1}</span>
								</p>
							</section>
						</div>
					</hlm-carousel-item>
					`,
					).join('\n')}
        </hlm-carousel-content>
        <button hlm-carousel-previous></button>
        <button hlm-carousel-next></button>
      </hlm-carousel>
    </div>
    `,
	}),
};

export const Orientation: Story = {
	render: () => ({
		template: `
    <div class="flex items-center justify-center w-full p-4">
      <hlm-carousel class="w-full max-w-xs" orientation="vertical">
        <hlm-carousel-content class="-mt-1 h-[200px]">
					${Array.from(
						{ length: 5 },
						(_, i) => `
					<hlm-carousel-item class="pt-1 md:basis-1/2">
						<div class="p-1">
							<section hlmCard>
								<p hlmCardContent class="flex items-center justify-center p-6">
									<span class="text-4xl font-semibold">${i + 1}</span>
								</p>
							</section>
						</div>
					</hlm-carousel-item>
					`,
					).join('\n')}
        </hlm-carousel-content>
        <button hlm-carousel-previous></button>
        <button hlm-carousel-next></button>
      </hlm-carousel>
    </div>
    `,
	}),
};

export const Plugins: Story = {
	args: {
		plugins: [Autoplay({ delay: 3000 })],
	},
	render: ({ ...args }) => ({
		props: args,
		template: `
    <div class="flex items-center justify-center w-full p-4">
      <hlm-carousel class="w-full max-w-xs" ${argsToTemplate(args)}>
        <hlm-carousel-content>
        ${Array.from(
					{ length: 5 },
					(_, i) => `
        <hlm-carousel-item>
          <div class="p-1">
            <section hlmCard>
              <p hlmCardContent class="flex items-center justify-center p-6 aspect-square">
                <span class="text-4xl font-semibold">${i + 1}</span>
              </p>
            </section>
          </div>
        </hlm-carousel-item>
        `,
				).join('\n')}
        </hlm-carousel-content>
        <button hlm-carousel-previous></button>
        <button hlm-carousel-next></button>
      </hlm-carousel>
    </div>
    `,
	}),
};
