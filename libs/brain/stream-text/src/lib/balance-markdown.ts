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

	// 2. Remove complete code spans (matching backtick run lengths); they hide `**`.
	const withoutSpans = outsideFences.replace(/(`+)([\s\S]*?[^`])\1(?!`)/g, '');

	// 3. Balance inline code: any backtick run left over is an unclosed opener.
	let result = text;
	const leftover = /`+/.exec(withoutSpans);
	if (leftover) {
		result += leftover[0];
	}

	// 4. Balance bold markers (**), ignoring code spans and an unclosed code span tail.
	const outsideCode = leftover ? withoutSpans.slice(0, leftover.index) : withoutSpans;
	if ((outsideCode.match(/\*\*/g)?.length ?? 0) % 2 !== 0) {
		result += '**';
	}

	return result;
}
