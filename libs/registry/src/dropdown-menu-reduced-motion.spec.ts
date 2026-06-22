import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { STYLES } from './styles/style';

const dropdownSelectors = ['spartan-dropdown-menu-content', 'spartan-dropdown-menu-sub-content'];

describe('dropdown menu reduced motion styles', () => {
	for (const style of STYLES) {
		it(`only enables animations when motion is safe for ${style}`, () => {
			const stylesheet = readFileSync(new URL(`./styles/style-${style}.css`, import.meta.url), 'utf8');

			for (const selector of dropdownSelectors) {
				const block = stylesheet.match(new RegExp(`&?\\.${selector}\\s*\\{([^}]*)\\}`))?.[1];

				expect(block, `${selector} is missing from ${style}`).toContain('motion-safe:data-open:animate-in');
				expect(block, `${selector} is missing from ${style}`).toContain('motion-safe:data-closed:animate-out');
				expect(block, `${selector} has an unguarded enter animation in ${style}`).not.toMatch(
					/(?:^|\s)data-open:animate-in(?:\s|;)/,
				);
				expect(block, `${selector} has an unguarded exit animation in ${style}`).not.toMatch(
					/(?:^|\s)data-closed:animate-out(?:\s|;)/,
				);
			}
		});
	}
});
