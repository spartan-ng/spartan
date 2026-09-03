import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { STYLES } from './styles/style';

const tooltipBlock = (style: (typeof STYLES)[number]) => {
	const stylesheet = readFileSync(new URL(`./styles/style-${style}.css`, import.meta.url), 'utf8');
	return stylesheet.match(/\.spartan-chart-tooltip\s*\{([^}]*)\}/)?.[1];
};

const chartBlock = (style: (typeof STYLES)[number]) => {
	const stylesheet = readFileSync(new URL(`./styles/style-${style}.css`, import.meta.url), 'utf8');
	return stylesheet.match(/\.spartan-chart\s*\{([^}]*)\}/)?.[1];
};

describe('chart styles', () => {
	for (const style of STYLES) {
		it(`uses TanStack tooltip variables for ${style}`, () => {
			const block = tooltipBlock(style);

			expect(block, `chart tooltip is missing from ${style}`).toContain(
				'[--ts-chart-tooltip-background:var(--popover)]',
			);
			expect(block).toContain('[--ts-chart-tooltip-border:');
			expect(block, `chart tooltip is missing from ${style}`).toContain('[--ts-chart-tooltip-border-radius:');
			expect(block).toContain('[--ts-chart-tooltip-color:var(--popover-foreground)]');
			expect(block).toContain('[--ts-chart-tooltip-font:');
			expect(block).toContain('[--ts-chart-tooltip-padding:');
			expect(block).toContain('[--ts-chart-tooltip-shadow:');
			expect(
				block
					?.match(/@apply\s+(.+);/)?.[1]
					.split(/\s+/)
					.every((token) => token.startsWith('[') || token.startsWith('dark:[')),
			).toBe(true);
		});

		it(`keeps chart layout in the ${style} registry style`, () => {
			expect(chartBlock(style)).toContain('@apply block w-full text-xs;');
		});
	}

	it('preserves the distinctive Lyra, Mira, and Luma treatments', () => {
		expect(tooltipBlock('lyra')).toContain('[--ts-chart-tooltip-border-radius:0px]');
		expect(tooltipBlock('mira')).toContain('var(--leading-relaxed)');
		expect(tooltipBlock('luma')).toContain('[--ts-chart-tooltip-border-radius:calc(var(--radius)*1.4)]');
		expect(tooltipBlock('luma')).toContain('[--ts-chart-tooltip-shadow:var(--shadow-lg),');
		expect(tooltipBlock('nova')).toContain('[--ts-chart-tooltip-shadow:var(--shadow-xl)]');
	});
});
