import { createFirstPartyRegistryItem } from './first-party';

describe('first-party registry items', () => {
	it('creates registry metadata from bundled component templates', async () => {
		const item = await createFirstPartyRegistryItem('button');

		expect(item?.name).toBe('button');
		expect(item?.type).toBe('registry:ui');
		expect(item?.registryDependencies).toContain('@spartan/utils');
		expect(item?.files?.some((file) => file.target === 'index.ts')).toBe(true);
	});
});
