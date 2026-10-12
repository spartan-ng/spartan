import { parseRegistryAndItemFromString } from './parser';
import { isLocalFile, isUrl } from './utils';

export type ResolvedItemAddress =
	| { scheme: 'url'; url: string }
	| { scheme: 'file'; path: string }
	| { scheme: 'namespace'; namespace: string; item: string }
	| { scheme: 'spartan'; item: string };

export function resolveItemAddress(address: string): ResolvedItemAddress {
	if (isUrl(address)) {
		return { scheme: 'url', url: address };
	}

	if (isLocalFile(address)) {
		return { scheme: 'file', path: address };
	}

	const { registry, item } = parseRegistryAndItemFromString(address);
	if (registry) {
		return { scheme: 'namespace', namespace: registry, item };
	}

	return { scheme: 'spartan', item: address };
}
