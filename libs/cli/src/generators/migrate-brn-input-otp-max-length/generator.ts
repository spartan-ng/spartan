import { formatFiles, type Tree } from '@nx/devkit';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateBrnInputOtpMaxLength } from './schema';

const inputOtpTagPattern = /<(brn-input-otp)\b[^>]*>/g;

export async function migrateBrnInputOtpMaxLength(tree: Tree, { skipFormat }: MigrateBrnInputOtpMaxLength) {
	renameMaxLengthInput(tree);

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function renameMaxLengthInput(tree: Tree) {
	visitFiles(tree, '.', (path) => {
		if (!path.endsWith('.html') && !path.endsWith('.ts')) {
			return;
		}

		let content = tree.read(path, 'utf-8');

		if (!content) {
			return;
		}

		inputOtpTagPattern.lastIndex = 0;
		content = content.replace(inputOtpTagPattern, (tag) => renameLegacyMaxLengthInput(tag));

		tree.write(path, content);
	});
}

function renameLegacyMaxLengthInput(tag: string) {
	return tag.replace(/(\s)\[maxLength\](\s*=)/g, '$1[length]$2').replace(/(\s)maxLength(\s*=)/g, '$1length$2');
}

export default migrateBrnInputOtpMaxLength;
