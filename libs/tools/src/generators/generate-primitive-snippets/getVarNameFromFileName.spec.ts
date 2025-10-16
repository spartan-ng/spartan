import { getVariableNameFromFilename } from './getVarNameFromFileName';

describe('getVariableNameFromFilename', () => {
	it("should handle simple preview files by returning 'default' when the filename is the primitive name", () => {
		const fileName = 'button.preview.ts';
		const primitiveName = 'button';
		const result = getVariableNameFromFilename(fileName, primitiveName);
		expect(result).toBe('default');
	});

	it('should convert a kebab-case filename to camelCase', () => {
		const fileName = 'accordion-multiple-opened.example.ts';
		const primitiveName = 'accordion';
		const result = getVariableNameFromFilename(fileName, primitiveName);
		expect(result).toBe('multipleOpened');
	});

	it('should handle filenames with double hyphens as separators', () => {
		const fileName = 'button--with-icon.example.ts';
		const primitiveName = 'button';
		const result = getVariableNameFromFilename(fileName, primitiveName);
		expect(result).toBe('withIcon');
	});

	it('should correctly process a single variant name', () => {
		const fileName = 'alert-destructive.preview.ts';
		const primitiveName = 'alert';
		const result = getVariableNameFromFilename(fileName, primitiveName);
		expect(result).toBe('destructive');
	});

	it('should ensure the resulting variable name starts with a lowercase letter', () => {
		const fileName = 'Toggle-group-outline.example.ts';
		const primitiveName = 'toggle-group';
		const result = getVariableNameFromFilename(fileName, primitiveName);
		expect(result).toBe('toggleGroupOutline');

		const directCaseFileName = 'button-Outline.example.ts';
		const directCaseResult = getVariableNameFromFilename(directCaseFileName, 'button');
		expect(directCaseResult).toBe('outline');
	});
});
