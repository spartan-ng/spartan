import { formatFiles, logger, Tree } from '@nx/devkit';
import { Healthcheck, HealthcheckReport, HealthcheckStatus, isHealthcheckFixable } from './healthchecks';
import { brainImportsHealthcheck } from './healthchecks/brain-imports';
import { brainRadioHealthcheck } from './healthchecks/brn-radio';
import { brainSeparatorHealthcheck } from './healthchecks/brn-separator';
import { brainToggleHealthcheck } from './healthchecks/brn-toggle-group';
import { coreImportsHealthcheck } from './healthchecks/core-imports';
import { helmImportsHealthcheck } from './healthchecks/helm-imports';
import { hlmImportHealthcheck } from './healthchecks/hlm';
import { datePickerHealthcheck } from './healthchecks/hlm-date-picker';
import { helmIconHealthcheck } from './healthchecks/hlm-icon';
import { progressHealthcheck } from './healthchecks/hlm-progress';
import { scrollAreaHealthcheck } from './healthchecks/hlm-scroll-area';
import { selectHealthcheck } from './healthchecks/hlm-select';
import { namingConventionHealthcheck } from './healthchecks/naming-conventions';
import { versionHealthcheck } from './healthchecks/version';
import { HealthcheckGeneratorSchema } from './schema';
import { promptUser } from './utils/prompt';
import { printReport } from './utils/reporter';
import { runHealthcheck } from './utils/runner';

export async function healthcheckGenerator(tree: Tree, options: HealthcheckGeneratorSchema & { angularCli?: boolean }) {
	logger.info('Running healthchecks...');

	const healthchecks: Healthcheck[] = [
		versionHealthcheck,
		brainImportsHealthcheck,
		coreImportsHealthcheck,
		helmIconHealthcheck,
		scrollAreaHealthcheck,
		brainRadioHealthcheck,
		selectHealthcheck,
		brainToggleHealthcheck,
		helmImportsHealthcheck,
		namingConventionHealthcheck,
		datePickerHealthcheck,
		progressHealthcheck,
		hlmImportHealthcheck,
		brainSeparatorHealthcheck,
	];

	const failedReports: HealthcheckReport[] = [];

	for (const healthcheck of healthchecks) {
		const report = await runHealthcheck(tree, healthcheck);
		printReport(report);

		if (report.status === HealthcheckStatus.Failure) {
			failedReports.push(report);
		}
	}

	for (const report of failedReports) {
		if (report.fixable && isHealthcheckFixable(report.healthcheck)) {
			const fix = options.autoFix || (await promptUser(report.healthcheck.prompt));

			if (fix) {
				await report.healthcheck.fix(tree, { angularCli: options.angularCli });
			}
		}
	}

	if (!options.skipFormat) {
		await formatFiles(tree);
	}
}

export default healthcheckGenerator;
