function hashString(str: string) {
	let h;
	for (let i = 0; i < str.length; i++) h = (Math.imul(31, h || 0) + str.charCodeAt(i)) | 0;

	return h || 0;
}

function hashManyTimes(times: number, str: string) {
	let h = hashString(str);

	for (let i = 0; i < times; i++) h = hashString(String(h));

	return h;
}

export function hexColorFor(str: string) {
	const hash = str.length <= 2 ? hashManyTimes(5, str) : hashString(str);

	let color = '#';

	for (let i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}

	return color;
}
