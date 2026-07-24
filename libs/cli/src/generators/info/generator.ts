import { logger, type Tree } from '@nx/devkit';
import { collectSpartanInfo, type SpartanInfo } from './lib/collect-info';
import type { InfoGeneratorSchema } from './schema';

export async function infoGenerator(
	tree: Tree,
	options: InfoGeneratorSchema & { angularCli?: boolean },
): Promise<void> {
	const availablePrimitives: Record<string, unknown> = await import('../ui/supported-ui-libraries.json').then(
		(m) => m.default,
	);

	const info = collectSpartanInfo(tree, Object.keys(availablePrimitives), { angularCli: options.angularCli });

	if (options.json) {
		// Print machine-readable JSON only, so agents and tooling can parse stdout directly.
		logger.info(JSON.stringify(info, null, 2));
	} else {
		printHumanReadable(info);
	}

	// `info` is read-only: it never modifies the workspace, so there is no task to return.
}

function printHumanReadable(info: SpartanInfo): void {
	const lines: string[] = [];
	lines.push('Spartan project info');
	lines.push('');
	lines.push(`  Workspace:        ${info.workspaceType}`);
	lines.push(`  Config found:     ${info.config.found ? 'yes' : 'no (using defaults)'}`);
	lines.push(`  Components path:   ${info.config.componentsPath}`);
	lines.push(`  Import alias:      ${info.config.importAlias}`);
	if (info.config.generateAs) {
		lines.push(`  Generate as:       ${info.config.generateAs}`);
	}
	lines.push('');
	lines.push('  Versions');
	lines.push(`    @angular/core:   ${info.versions.angular ?? '-'}`);
	lines.push(`    @angular/cdk:    ${info.versions.angularCdk ?? '-'}`);
	lines.push(`    tailwindcss:     ${info.versions.tailwind ?? '-'}`);
	lines.push(`    @spartan-ng/brain: ${info.versions.spartanBrain ?? '-'}`);
	lines.push(`    @spartan-ng/cli:   ${info.versions.spartanCli ?? '-'}`);
	lines.push('');
	lines.push(`  Icon library:      ${info.iconLibrary ?? '-'}`);
	lines.push(`  Styles file:       ${info.tailwindCssFile ?? '-'}`);
	lines.push('');
	lines.push(
		`  Installed (${info.installedComponents.length}/${info.availableComponents.length}): ${
			info.installedComponents.length ? info.installedComponents.join(', ') : '-'
		}`,
	);
	lines.push('');
	lines.push('  Tip: run with --json to get machine-readable output for AI agents.');

	logger.info(lines.join('\n'));
}

export default infoGenerator;
