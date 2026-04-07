import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateCssLogicalPropertiesGeneratorSchema } from './schema';

/**
 * Mapping of physical Tailwind CSS class prefixes/names to their logical equivalents.
 * Order matters: more specific patterns must come before less specific ones
 * to avoid partial matches.
 */
const REPLACEMENTS: [RegExp, string][] = [
	// Scroll padding/margin (must come before pl-/pr-/ml-/mr-)
	[/\bscroll-pl-/g, 'scroll-ps-'],
	[/\bscroll-pr-/g, 'scroll-pe-'],
	[/\bscroll-ml-/g, 'scroll-ms-'],
	[/\bscroll-mr-/g, 'scroll-me-'],

	// Border width: border-l-* → border-s-*, border-r-* → border-e-*
	// Patterns with value suffix must come before standalone patterns
	[/\bborder-l-/g, 'border-s-'],
	[/\bborder-r-/g, 'border-e-'],
	// Standalone border-l/border-r (e.g. `first:border-l` → `first:border-s`)
	[/\bborder-l\b/g, 'border-s'],
	[/\bborder-r\b/g, 'border-e'],

	// Rounded corners (must come before generic l-/r- patterns)
	[/\brounded-tl-/g, 'rounded-ss-'],
	[/\brounded-tr-/g, 'rounded-se-'],
	[/\brounded-bl-/g, 'rounded-es-'],
	[/\brounded-br-/g, 'rounded-ee-'],
	[/\brounded-l-/g, 'rounded-s-'],
	[/\brounded-r-/g, 'rounded-e-'],

	// Padding
	[/\bpl-/g, 'ps-'],
	[/\bpr-/g, 'pe-'],

	// Margin
	[/\bml-/g, 'ms-'],
	[/\bmr-/g, 'me-'],

	// Text align
	[/\btext-left\b/g, 'text-start'],
	[/\btext-right\b/g, 'text-end'],

	// Float
	[/\bfloat-left\b/g, 'float-start'],
	[/\bfloat-right\b/g, 'float-end'],

	// Clear
	[/\bclear-left\b/g, 'clear-start'],
	[/\bclear-right\b/g, 'clear-end'],

	// Note: left-*/right-* positional inset classes (left-0, right-2, etc.) are NOT
	// auto-migrated because they are too context-dependent. Examples of cases where
	// physical positioning must be preserved:
	// - Sheet side variants: left-0/right-0 for physical screen edges
	// - Sidebar rail: group-data-[side=left]:-right-4 (physical side concept)
	// - Centering patterns: left-1/2 -translate-x-1/2
	// These should be reviewed and converted manually where appropriate.
];

export async function migrateCssLogicalPropertiesGenerator(
	tree: Tree,
	{ skipFormat }: MigrateCssLogicalPropertiesGeneratorSchema,
) {
	replacePhysicalWithLogical(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

/**
 * Patterns that indicate a file uses spartan components and may need migration.
 * Only files containing these markers are processed.
 */
const SPARTAN_MARKERS = [
	'@spartan-ng/',
	'hlm-',
	'brn-',
	'hlmBtn',
	'hlmIcon',
	'hlmInput',
	'hlmLabel',
	'hlmTooltip',
	'hlmAccordion',
	'hlmAlert',
	'hlmBadge',
	'hlmCard',
	'hlmCheckbox',
	'hlmDialog',
	'hlmDropdown',
	'hlmMenu',
	'hlmPopover',
	'hlmProgress',
	'hlmRadio',
	'hlmSelect',
	'hlmSeparator',
	'hlmSheet',
	'hlmSkeleton',
	'hlmSlider',
	'hlmSwitch',
	'hlmTable',
	'hlmTabs',
	'hlmTextarea',
	'hlmToggle',
];

function isSpartanFile(content: string): boolean {
	return SPARTAN_MARKERS.some((marker) => content.includes(marker));
}

function replacePhysicalWithLogical(tree: Tree) {
	visitFiles(tree, '.', (path) => {
		if (!path.endsWith('.ts') && !path.endsWith('.html')) {
			return;
		}

		const content = tree.read(path, 'utf-8');

		if (!content || !isSpartanFile(content)) {
			return;
		}

		let updated = content;

		for (const [pattern, replacement] of REPLACEMENTS) {
			updated = updated.replace(pattern, replacement);
		}

		if (updated !== content) {
			tree.write(path, updated);
		}
	});
}

export default migrateCssLogicalPropertiesGenerator;
