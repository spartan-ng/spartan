/**
 * Waits for all animations (including subtree) within the given element to finish.
 * Ignores animations canceled with an AbortError.
 */
export async function waitForElementAnimations(el: HTMLElement): Promise<void> {
	// Wait a tick to allow newly triggered animations to start
	await new Promise<void>((resolve) => setTimeout(resolve, 0));

	const animationFillMode = el.style.animationFillMode;
	const animations = el.getAnimations({ subtree: true });
	el.style.animationFillMode = 'forwards';

	await Promise.all(
		animations.map((animation) =>
			animation.finished.catch((err) => {
				// Ignore AbortError from canceled animations (treated as "finished")
				if (!(err instanceof Error && err.name === 'AbortError')) {
					throw err;
				}

				return animation;
			}),
		),
	);

	setTimeout(() => {
		if (el.style.animationFillMode === 'forwards') el.style.animationFillMode = animationFillMode;
	});
}
