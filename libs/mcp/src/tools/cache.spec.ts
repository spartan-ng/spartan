import { CacheManager } from './cache';

describe('CacheManager cache-key validation', () => {
	const manager = new CacheManager();

	it('rejects component names that contain path separators', async () => {
		await expect(manager.getComponent('../../etc/passwd')).rejects.toThrow(/Invalid cache key/);
	});

	it('rejects block names that contain path separators', async () => {
		await expect(manager.getBlock('foo/bar')).rejects.toThrow(/Invalid cache key/);
	});

	it('rejects traversal segments as docs topics', async () => {
		await expect(manager.getDocs('..')).rejects.toThrow(/Invalid cache key/);
	});

	it('rejects invalid versions before touching the filesystem', async () => {
		await expect(manager.switchVersion('../..')).rejects.toThrow(/Invalid version/);
	});
});
