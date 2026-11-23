/**
 * Balances unclosed Markdown tokens during active streaming to prevent layout flicker
 * and DOM thrash. Handles unclosed code fences, inline code and bold (`**`) markers.
 */
export function balanceMarkdown(text: string): string {
	if (!text) {
		return text;
	}

	// 1. Scan lines for fences. A closing fence uses the opener's character and at least its length.
	const lines = text.split('\n');
	let openFence: { char: string; length: number } | null = null;
	const outsideLines: string[] = [];
	for (const line of lines) {
		const match = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
		if (openFence) {
			if (match && match[1][0] === openFence.char && match[1].length >= openFence.length && match[2].trim() === '') {
				openFence = null;
			}
			continue;
		}
		if (match && !(match[1][0] === '`' && match[2].includes('`'))) {
			openFence = { char: match[1][0], length: match[1].length };
			continue;
		}
		outsideLines.push(line);
	}

	if (openFence) {
		// Fence is open; close it at the end. Nothing inside a fence is Markdown.
		return `${text}\n${openFence.char.repeat(openFence.length)}`;
	}

	const outsideFences = outsideLines.join('\n');

	// 2. Pair backtick runs of equal length into code spans in a single linear pass.
	const runs: { index: number; length: number }[] = [];
	for (const match of outsideFences.matchAll(/`+/g)) {
		runs.push({ index: match.index, length: match[0].length });
	}
	const runsByLength = new Map<number, number[]>();
	runs.forEach((run, i) => runsByLength.set(run.length, [...(runsByLength.get(run.length) ?? []), i]));
	const cursor = new Map<number, number>();

	let outsideCode = '';
	let position = 0;
	let unclosedRun: { index: number; length: number } | null = null;
	for (let i = 0; i < runs.length; ) {
		const run = runs[i];
		const sameLength = runsByLength.get(run.length) ?? [];
		let next = cursor.get(run.length) ?? 0;
		while (next < sameLength.length && sameLength[next] <= i) {
			next++;
		}
		cursor.set(run.length, next);
		const closer = sameLength[next];
		if (closer === undefined) {
			unclosedRun = run;
			break;
		}
		outsideCode += outsideFences.slice(position, run.index);
		position = runs[closer].index + runs[closer].length;
		i = closer + 1;
	}

	// 3. Balance inline code: the first unmatched run is an unclosed opener.
	let result = text;
	if (unclosedRun) {
		result += '`'.repeat(unclosedRun.length);
		outsideCode += outsideFences.slice(position, unclosedRun.index);
	} else {
		outsideCode += outsideFences.slice(position);
	}

	// 4. Balance bold markers (**), ignoring code spans and an unclosed code span tail.
	if ((outsideCode.match(/\*\*/g)?.length ?? 0) % 2 !== 0) {
		result += '**';
	}

	return result;
}
