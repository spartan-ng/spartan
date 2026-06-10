/**
 * Jest globalTeardown: stop the local registry started in global-setup.
 */
export default async function () {
	const stop = (globalThis as Record<string, unknown>).__STOP_LOCAL_REGISTRY__ as (() => void) | undefined;
	stop?.();
}
