const isShortHand = (hex: string) => hex.length === 3;

const cleanup = (hex: string) => {
	const noHash = hex.replace('#', '').trim().toLowerCase();

	if (!isShortHand(noHash)) return noHash;

	return noHash
		.split('')
		.map((char) => char + char)
		.join('');
};

export const isBright = (hex: string) => Number.parseInt(cleanup(hex), 16) > 0xffffff / 1.25;
