import { formatFiles, logger, type Tree } from '@nx/devkit';
import { getImportAlias } from '../../utils/config';
import { type Healthcheck, type HealthcheckReport, HealthcheckStatus, isHealthcheckFixable } from './healthchecks';
import { brainImportsHealthcheck } from './healthchecks/brain-imports';
import { brainAccordionTriggerHealthcheck } from './healthchecks/brn-accordion-trigger';
import { brnCheckboxChangedEventRename } from './healthchecks/brn-checkbox-changed-event-rename';
import { brainCollapsibleHealthcheck } from './healthchecks/brn-collapsible';
import { brainRadioHealthcheck } from './healthchecks/brn-radio';
import { brainSeparatorHealthcheck } from './healthchecks/brn-separator';
import { brnSwitchChangedEventRename } from './healthchecks/brn-switch-changed-event-rename';
import { brainToggleHealthcheck } from './healthchecks/brn-toggle';
import { brainToggleGroupHealthcheck } from './healthchecks/brn-toggle-group';
import { brainToggleGroup2Healthcheck } from './healthchecks/brn-toggle-group-2';
import { coreImportsHealthcheck } from './healthchecks/core-imports';
import { helmImportsHealthcheck } from './healthchecks/helm-imports';
import { hlmImportHealthcheck } from './healthchecks/hlm';
import { datePickerHealthcheck } from './healthchecks/hlm-date-picker';
import { helmDialogHealthcheck } from './healthchecks/hlm-dialog';
import { helmIconHealthcheck } from './healthchecks/hlm-icon';
import { helmMenuHealthcheck } from './healthchecks/hlm-menu';
import { progressHealthcheck } from './healthchecks/hlm-progress';
import { scrollAreaHealthcheck } from './healthchecks/hlm-scroll-area';
import { selectHealthcheck } from './healthchecks/hlm-select';
import { moduleImportsHealthcheck } from './healthchecks/module-imports';
import { namingConventionHealthcheck } from './healthchecks/naming-conventions';
import { versionHealthcheck } from './healthchecks/version';
import type { HealthcheckGeneratorSchema } from './schema';
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
		brainToggleGroupHealthcheck,
		helmImportsHealthcheck,
		namingConventionHealthcheck,
		datePickerHealthcheck,
		progressHealthcheck,
		hlmImportHealthcheck,
		brainSeparatorHealthcheck,
		brnCheckboxChangedEventRename,
		brnSwitchChangedEventRename,
		brainAccordionTriggerHealthcheck,
		moduleImportsHealthcheck,
		brainToggleHealthcheck,
		brainToggleGroup2Healthcheck,
		brainCollapsibleHealthcheck,
		helmMenuHealthcheck,
		helmDialogHealthcheck,
	];

	const failedReports: HealthcheckReport[] = [];

	const importAlias = await getImportAlias(tree, options.angularCli);

	for (const healthcheck of healthchecks) {
		const report = await runHealthcheck(tree, healthcheck, importAlias);
		printReport(report);

		if (report.status === HealthcheckStatus.Failure) {
			failedReports.push(report);
		}
	}

	for (const report of failedReports) {
		if (report.fixable && isHealthcheckFixable(report.healthcheck)) {
			const fix = options.autoFix || (await promptUser(report.healthcheck.prompt));

			if (fix) {
				await report.healthcheck.fix(tree, { angularCli: options.angularCli, importAlias });
			}
		}
	}

	if (!options.skipFormat) {
		await formatFiles(tree);
	}
}

export default healthcheckGenerator;
