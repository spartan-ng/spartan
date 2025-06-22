import { getVariableNameFromFilename } from './getVarNameFromFileName';

describe('extractCodenaemeFromFileName', () => {
	it('should extract the code name from the file name', () => {
		const fileName = 'foo.preview.ts';
		const result = getVariableNameFromFilename(fileName);
		expect(result).toBe('fooCode');
	});
});
