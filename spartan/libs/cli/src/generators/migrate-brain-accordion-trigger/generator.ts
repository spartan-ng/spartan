import { formatFiles, type Tree } from '@nx/devkit';
import { NodeType } from 'node-html-parser';
import { Project } from 'ts-morph';
import { visitFiles } from '../../utils/visit-files';
import type { MigrateAccordionTriggerGeneratorSchema } from './schema';
import {
	findAccordionButtons,
	type HTMLElement,
	parseHtmlForAccordionMigration,
	wrapButtonInHeading,
} from './utils/html-utils';
import {
	analyzeButton,
	type ButtonAnalysis,
	extractInlineTemplate,
	hasAccordionTriggers,
	shouldProcessFile,
} from './utils/shared-utils';

export default async function migrateAccordionTriggerGenerator(
	tree: Tree,
	{ skipFormat }: MigrateAccordionTriggerGeneratorSchema,
) {
	const issues: string[] = [];
	const project = new Project({ useInMemoryFileSystem: true });

	wrapAccordionTriggers(tree, project, issues);

	if (issues.length > 0) {
		reportManualFixesNeeded(issues);
	}

	if (!skipFormat) {
		await formatFiles(tree);
	}
}

function wrapAccordionTriggers(tree: Tree, project: Project, issues: string[]) {
	visitFiles(tree, '.', (path) => {
		console.log('Processing ' + path + '...');
		if (!shouldProcessFile(path)) return;

		const content = tree.read(path, 'utf-8');
		if (!content || !hasAccordionTriggers(content)) return;

		const result = path.endsWith('.html')
			? fixTemplate(content, path, issues)
			: fixComponentFile(content, path, project, issues);

		if (result?.modified) {
			tree.write(path, result.content);
			console.log(`Fixed ${result.fixedCount} accordion trigger(s) in ${path}`);
		}
	});
}

interface FixResult {
	content: string;
	modified: boolean;
	fixedCount: number;
}

function fixTemplate(
	content: string,
	filePath: string,
	issues: string[],
	options: { noContentsClass: boolean } = { noContentsClass: false },
): FixResult {
	const root = parseHtmlForAccordionMigration(content);
	const buttons = findAccordionButtons(root);
	let fixedCount = 0;

	for (const button of buttons) {
		const analysis = analyzeButton(button);

		switch (analysis.issue) {
			case 'NotInHeading':
				wrapButtonInHeading(button, !options.noContentsClass);
				fixedCount++;
				break;

			case 'HasSiblings':
				logSiblingIssue(analysis, filePath, issues);
				break;

			case 'NoIssue':
				break;
		}
	}

	if (fixedCount > 0) {
		return {
			content: formatHtmlOutput(root),
			modified: true,
			fixedCount,
		};
	}

	return { content, modified: false, fixedCount: 0 };
}

function fixComponentFile(content: string, filePath: string, project: Project, issues: string[]): FixResult {
	const sourceFile = project.createSourceFile(filePath, content, { overwrite: true });

	const templateInfo = extractInlineTemplate(sourceFile);
	if (!templateInfo) {
		return { content, modified: false, fixedCount: 0 };
	}

	// Fix the template content
	const result = fixTemplate(templateInfo.text, filePath, issues);

	if (result.modified && templateInfo.propertyAssignment.getInitializer()) {
		// Replace template in source file
		const quoteStyle = templateInfo.originalQuoteStyle || '`';
		let newTemplateValue: string;

		if (quoteStyle === '`') {
			newTemplateValue = `\`${result.content}\``;
		} else if (quoteStyle === '"') {
			newTemplateValue = `"${result.content.replace(/"/g, '\\"')}"`;
		} else {
			newTemplateValue = `'${result.content.replace(/'/g, "\\'")}'`;
		}

		templateInfo.propertyAssignment.getInitializer().replaceWithText(newTemplateValue);

		return {
			content: sourceFile.getFullText(),
			modified: true,
			fixedCount: result.fixedCount,
		};
	}

	return { content, modified: false, fixedCount: 0 };
}

function logSiblingIssue(analysis: ButtonAnalysis, filePath: string, issues: string[]) {
	const parent = analysis.parent;
	const siblingContent = getSiblingPreview(analysis.button, parent);

	issues.push(
		`! ${filePath}\n` +
			` - Button "${analysis.buttonText}" in <${parent.tagName.toLowerCase()}> ` +
			`has siblings that need to be moved: ${siblingContent}...\n`,
	);
}

function getSiblingPreview(button: HTMLElement, parent: HTMLElement): string {
	return parent.childNodes
		.filter((child) => child !== button)
		.map((child) => {
			if (child.nodeType === NodeType.TEXT_NODE) {
				return child.text?.trim();
			}
			return child.toString();
		})
		.filter(Boolean)
		.join(', ')
		.substring(0, 50);
}

function formatHtmlOutput(root: HTMLElement): string {
	const output = root.toString();
	// Convert empty tags to self-closing
	return output.replace(/<([^>\s]+)([^>]*)><\/\1>/g, '<$1$2/>');
}

function reportManualFixesNeeded(issues: string[]) {
	console.log(
		`We also detected ${issues.length} accordion trigger buttons ` +
			`that have siblings that need to be manually moved:`,
	);
	issues.forEach((issue) => console.log(issue));
	console.log('To learn more about this pattern see: ' + 'https://www.w3.org/WAI/ARIA/apg/patterns/accordion/');
}
