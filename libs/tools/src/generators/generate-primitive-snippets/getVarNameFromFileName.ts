/**
 * Converts a filename in the format 'primitive-name--variant.example.ts'
 * into a camelCase TypeScript variable name like 'variantCode'.
 *
 * @param {string} filename - The input filename.
 * @param {string} primitiveName - The name of the primitive, which will be removed from the start of the filename.
 * @returns {string} The transformed camelCase variable name.
 */
export function getVariableNameFromFilename(filename: string, primitiveName: string): string {
	// 1. Remove the file extension part '.example.ts' or '.preview.ts'
	let baseName = filename.replace(/\.example\.ts$/, '').replace(/\.preview\.ts$/, '');

	// If baseName is just the primitive name, return that + Code.
	if (baseName === primitiveName) {
		return `default`;
	}

	// 2. Remove the primitive name prefix
	if (baseName.startsWith(primitiveName)) {
		baseName = baseName.substring(primitiveName.length).replace(/^-+/, '');
	}

	// 3. Split the remaining string by '--' or '-' to handle different separators
	const parts = baseName.split(/--|-|\./).filter(Boolean);

	// 4. Transform the parts into a single camelCase string.
	const camelCaseName = parts
		.map((part, index) => {
			if (index === 0) {
				return part.toLowerCase();
			}
			// Capitalize the first letter and append the rest of the string
			return part.charAt(0).toUpperCase() + part.slice(1);
		})
		.join('');

	return camelCaseName;
}
