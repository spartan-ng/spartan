import { workspaceRoot } from '@nx/devkit';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function readGeneratedJson() {
	const file = join(workspaceRoot, 'dist/extracted-metadata/ui-api.json');
	return JSON.parse(readFileSync(file, 'utf8'));
}

describe('generate-ui-docs executor', () => {
	it('produces stable output', async () => {
		const generated = readGeneratedJson();
		expect(generated).toMatchSnapshot();
	});
});
