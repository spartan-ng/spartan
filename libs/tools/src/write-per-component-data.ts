// Writes a slug-keyed object out as one `<outputDir>/<slug>.json` per key, each keeping its slug key.
// `write` abstracts the sink so it works for both generators (`Tree.write`) and executors (`fs`).
export function writePerComponentData(
	data: Record<string, unknown>,
	outputDir: string,
	write: (filePath: string, content: string) => void,
): void {
	for (const [slug, value] of Object.entries(data)) {
		write(`${outputDir}/${slug}.json`, JSON.stringify({ [slug]: value }, null, 2));
	}
}
