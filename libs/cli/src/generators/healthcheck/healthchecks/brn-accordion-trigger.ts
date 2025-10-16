import { visitNotIgnoredFiles } from '@nx/devkit';
import { Project } from 'ts-morph';
import migrateAccordionTriggerGenerator from '../../migrate-brain-accordion-trigger/generator';
import {
	findAccordionButtons,
	getButtonText,
	hasSignificantSiblings,
	type HTMLElement,
	isInHeading,
	parseHtmlForAccordionMigration,
} from '../../migrate-brain-accordion-trigger/utils/html-utils';
import {
	extractInlineTemplate,
	hasAccordionTriggers,
	shouldProcessFile,
} from '../../migrate-brain-accordion-trigger/utils/shared-utils';
import { type Healthcheck, HealthcheckSeverity } from '../healthchecks';

interface Violation {
	file: string;
	line: number;
	type: 'not-in-heading' | 'not-only-child';
	buttonText?: string;
}

export const brainAccordionTriggerHealthcheck: Healthcheck = {
	name: 'Brain Accordion Trigger',
	async detect(tree, failure) {
		const project = new Project({ useInMemoryFileSystem: true });
		const violations: Violation[] = [];

		visitNotIgnoredFiles(tree, '/', (file) => {
			if (!shouldProcessFile(file)) return;

			const contents = tree.read(file, 'utf-8');
			if (!contents || !hasAccordionTriggers(contents)) return;

			const fileViolations = file.endsWith('.html')
				? findTemplateViolations(contents, file)
				: findComponentViolations(contents, file, project);

			violations.push(...fileViolations);
		});

		if (violations.length > 0) {
			const summary = generateViolationSummary(violations);
			failure(summary, HealthcheckSeverity.Error, true);
		}
	},
	fix: async (tree) => {
		await migrateAccordionTriggerGenerator(tree, { skipFormat: true });
		return true;
	},
	prompt: 'Would you like to migrate your brain accordion triggers?',
};

function findTemplateViolations(content: string, filePath: string): Violation[] {
	const violations: Violation[] = [];
	const root = parseHtmlForAccordionMigration(content);
	const buttons = findAccordionButtons(root);

	for (const button of buttons) {
		const violation = checkButton(button, filePath);
		if (violation) violations.push(violation);
	}
	return violations;
}

function checkButton(button: HTMLElement, filePath: string): Violation | null {
	if (!isInHeading(button)) {
		return {
			file: filePath,
			line: button.range?.[0] || 0,
			type: 'not-in-heading',
			buttonText: getButtonText(button),
		};
	}

	if (hasSignificantSiblings(button)) {
		return {
			file: filePath,
			line: button.range?.[0] || 0,
			type: 'not-only-child',
			buttonText: getButtonText(button),
		};
	}

	return null;
}

function findComponentViolations(content: string, filePath: string, project: Project): Violation[] {
	const sourceFile = project.createSourceFile(filePath, content, { overwrite: true });

	const templateContent = extractInlineTemplate(sourceFile);
	if (!templateContent) return [];

	const templateViolations = findTemplateViolations(templateContent.text, filePath);

	for (const violation of templateViolations) {
		violation.line += templateContent.startLine - 1;
	}

	return templateViolations;
}

function generateViolationSummary(violations: Violation[]): string {
	const notInHeading = violations.filter((v) => v.type === 'not-in-heading');
	const byFile = groupViolationsByFile(notInHeading);

	let summary = `Found ${notInHeading.length} accordion trigger(s) that need to be wrapped in headings:\n\n`;

	for (const [file, fileViolations] of byFile) {
		summary += `${file}\n`;
		summary += formatFileViolations(fileViolations);
	}

	return summary;
}

function groupViolationsByFile(violations: Violation[]): Map<string, Violation[]> {
	const byFile = new Map<string, Violation[]>();

	for (const violation of violations) {
		if (!byFile.has(violation.file)) {
			byFile.set(violation.file, []);
		}
		byFile.get(violation.file)!.push(violation);
	}

	return byFile;
}

function formatFileViolations(violations: Violation[]): string {
	return violations
		.map((v) => {
			let line = ` - Line ${v.line}`;
			if (v.buttonText) {
				line += ` - (button: "${v.buttonText}")`;
			}
			return line + '\n';
		})
		.join('');
}
