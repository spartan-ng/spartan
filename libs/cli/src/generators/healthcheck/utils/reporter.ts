import { logger } from '@nx/devkit';
import pc from 'picocolors';
import { HealthcheckReport, HealthcheckSeverity, HealthcheckStatus } from '../healthchecks';

export function printReport(report: HealthcheckReport): void {
	logger.log(`${getStatus(report.status)} ${report.name}`);

	// if this was a failure log the instructions
	if (report.status === HealthcheckStatus.Failure) {
		for (const issue of report.issues) {
			logger.log(`\t\t ${getSeverity(issue.severity)} ${issue.details}`);
		}
	}

	// if the healthcheck was skipped, log the reason
	if (report.status === HealthcheckStatus.Skipped) {
		logger.log(`\t\t ${pc.yellow(report.reason)}`);
	}
}

function getStatus(result: HealthcheckStatus) {
	switch (result) {
		case HealthcheckStatus.Success:
			return pc.green('[ ✔ ]');
		case HealthcheckStatus.Failure:
			return pc.red('[ ✖ ]');
		case HealthcheckStatus.Skipped:
			return pc.yellow('[ ! ]');
	}
}

function getSeverity(severity: HealthcheckSeverity) {
	switch (severity) {
		case HealthcheckSeverity.Error:
			return pc.red('✖');
		case HealthcheckSeverity.Warning:
			return pc.yellow('!');
	}
}
