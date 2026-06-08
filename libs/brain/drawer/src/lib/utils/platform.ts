/** Returns true when the array is sorted in non-decreasing order. */
export function isAscendingOrder(arr: number[]): boolean {
	for (let i = 0; i < arr.length - 1; i++) {
		if ((arr[i + 1] ?? 0) < (arr[i] ?? 0)) return false;
	}
	return true;
}

function testPlatform(re: RegExp): boolean {
	return typeof window !== 'undefined' && window.navigator != null
		? re.test(
				// @ts-expect-error userAgentData is not in all browsers
				window.navigator.userAgentData?.platform || window.navigator.platform,
			)
		: false;
}

function cached(fn: () => boolean): () => boolean {
	let res: boolean | null = null;
	return (): boolean => {
		if (res == null) {
			res = fn();
		}
		return res;
	};
}

const isMac = cached(() => testPlatform(/^Mac/i));

const isIPhone = cached(() => testPlatform(/^iPhone/i));

const isIPad = cached(() => testPlatform(/^iPad/i) || (isMac() && navigator.maxTouchPoints > 1));

export const isIOS = cached(() => isIPhone() || isIPad());
