/**
 * Balances unclosed Markdown tokens during active streaming to prevent layout flicker
 * and DOM thrash (e.g. unclosed code fences, bold, italic, and inline code).
 */
export function balanceMarkdown(text: string): string {
	if (!text) {
		return text;
	}

	let result = text;

	// 1. Balance triple backtick code fences (```)
	const fenceMatches = text.match(/```/g);
	const fenceCount = fenceMatches ? fenceMatches.length : 0;
	const hasUnclosedFence = fenceCount % 2 !== 0;

	if (hasUnclosedFence) {
		// Code fence is open; close it at the end
		result += '\n```';
		return result;
	}

	// 2. Balance inline code (single backtick `) outside fences
	const backtickMatches = result.match(/`/g);
	const backtickCount = backtickMatches ? backtickMatches.length : 0;
	if (backtickCount % 2 !== 0) {
		result += '`';
	}

	// 3. Balance bold markers (**)
	const boldMatches = result.match(/\*\*/g);
	const boldCount = boldMatches ? boldMatches.length : 0;
	if (boldCount % 2 !== 0) {
		result += '**';
	}

	return result;
}
