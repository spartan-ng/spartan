const REGISTRY_PATTERN = /^(@[a-zA-Z0-9](?:[a-zA-Z0-9-_]*[a-zA-Z0-9])?)\/(.+)$/;

export function parseRegistryAndItemFromString(name: string): { registry: string | null; item: string } {
	if (!name.startsWith('@')) {
		return { registry: null, item: name };
	}

	const match = name.match(REGISTRY_PATTERN);
	if (!match) {
		return { registry: null, item: name };
	}

	return { registry: match[1], item: match[2] };
}
