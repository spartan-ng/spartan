/**
 * Balances unclosed Markdown tokens during active streaming to prevent layout flicker
 * and DOM thrash. Handles unclosed code fences, inline code and bold (`**`) markers.
 */
export function balanceMarkdown(text: string): string {
	if (!text) {
		return text;
	}

	// 1. Balance triple backtick code fences (```)
	const fenceCount = text.match(/```/g)?.length ?? 0;
	if (fenceCount % 2 !== 0) {
		// Code fence is open; close it at the end. Nothing inside a fence is Markdown.
		return `${text}\n\`\`\``;
	}

	// Ignore fenced blocks when counting inline markers.
	const outsideFences = text.replace(/```[\s\S]*?```/g, '');

	// 2. Balance inline code (single backtick `)
	const unclosedInlineCode = (outsideFences.match(/`/g)?.length ?? 0) % 2 !== 0;
	let result = unclosedInlineCode ? `${text}\`` : text;

	// 3. Balance bold markers (**), ignoring those inside inline code spans
	const outsideCode = outsideFences.replace(/`[^`]*`?/g, '');
	if ((outsideCode.match(/\*\*/g)?.length ?? 0) % 2 !== 0) {
		result += '**';
	}

	return result;
}
