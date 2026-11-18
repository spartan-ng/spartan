/** JavaScript / TypeScript sources that may import `clsx` or `tailwind-merge`. */
export const SOURCE_FILE_REGEX = /\.[cm]?[jt]sx?$/;

/**
 * Any reference to `clsx` or `tailwind-merge` (including subpaths) as a module: static, side-effect and dynamic
 * imports, and `require` calls. Used to decide whether the packages are still needed.
 */
export const LEGACY_IMPORT_REGEX =
	/(?:from\s*|import\s*\(\s*|require\s*\(\s*|import\s+)['"](clsx|tailwind-merge)(?:\/[^'"]*)?['"]/;

/** The legacy packages (`clsx`, `tailwind-merge`) a source still references. */
export function findLegacyPackages(content: string): string[] {
	return [...new Set(Array.from(content.matchAll(new RegExp(LEGACY_IMPORT_REGEX.source, 'g')), ([, name]) => name))];
}
