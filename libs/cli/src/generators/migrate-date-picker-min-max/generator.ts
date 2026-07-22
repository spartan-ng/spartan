import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateDatePickerMinMaxGeneratorSchema } from './schema';

const datePickerSelectors = [
	'hlm-date-picker-multi',
	'hlm-date-range-picker',
	'hlm-month-year-picker',
	'hlm-date-picker',
];

const datePickerTagPattern = new RegExp(`<(?:${datePickerSelectors.join('|')})(?=[\\s/>])[^>]*>`, 'g');

export async function migrateDatePickerMinMaxGenerator(
	tree: Tree,
	{ skipFormat }: MigrateDatePickerMinMaxGeneratorSchema,
) {
	replaceLegacyMinMaxInputs(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function replaceLegacyMinMaxInputs(tree: Tree) {
	visitFiles(tree, '.', (path) => {
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		datePickerTagPattern.lastIndex = 0;
		content = content.replace(datePickerTagPattern, (tag) => renameLegacyMinMaxInputs(tag));

		tree.write(path, content);
	});
}

function renameLegacyMinMaxInputs(tag: string) {
	return tag
		.replace(/(\s)\[min\](\s*=)/g, '$1[minDate]$2')
		.replace(/(\s)\[max\](\s*=)/g, '$1[maxDate]$2')
		.replace(/(\s)min(\s*=)/g, '$1minDate$2')
		.replace(/(\s)max(\s*=)/g, '$1maxDate$2');
}

export default migrateDatePickerMinMaxGenerator;
