import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { STYLES } from './styles/style';

const dropdownSelectors = ['spartan-dropdown-menu-content', 'spartan-dropdown-menu-sub-content'];

describe('dropdown menu reduced motion styles', () => {
	for (const style of STYLES) {
		it(`disables animations for ${style}`, () => {
			const stylesheet = readFileSync(new URL(`./styles/style-${style}.css`, import.meta.url), 'utf8');

			for (const selector of dropdownSelectors) {
				const block = stylesheet.match(new RegExp(`&?\\.${selector} \\{([^}]*)\\}`))?.[1];

				expect(block, `${selector} is missing from ${style}`).toContain('@apply motion-reduce:animate-none!;');
			}
		});
	}
});
