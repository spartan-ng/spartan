/**primige
 * Converts a filename in the format 'name--variant.example.ts'
 * into a camelCase TypeScript variable name like 'nameVariantCode'.
 *
 * @param {string} filename - The input filename.
 * @returns {string} The transformed camelCase variable name.
 */
export function getVariableNameFromFilename(filename: string): string {
	// 1. Remove the file extension part '.example.ts'
	const baseName = filename.replace(/\.example\.ts$/, '').replace(/\.preview\.ts$/, '');

	// 2. Split the remaining string by '--' or '-' to handle different separators
	// and filter out any empty strings that might result from multiple hyphens.
	const parts = baseName.split(/--|-|\./).filter(Boolean);

	// 3. Transform the parts into a single camelCase string.
	// The first part remains as is (lowercase).
	// Each subsequent part has its first letter capitalized.
	const camelCaseName = parts
		.map((part, index) => {
			if (index === 0) {
				return part;
			}
			// Capitalize the first letter and append the rest of the string
			return part.charAt(0).toUpperCase() + part.slice(1);
		})
		.join('');

	// 4. Append the 'Code' suffix and return the result.
	return `${camelCaseName}Code`;
}
