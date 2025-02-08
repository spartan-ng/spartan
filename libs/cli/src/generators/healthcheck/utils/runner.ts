import { Tree } from '@nx/devkit';
import {
	Healthcheck,
	HealthcheckFailureFn,
	HealthcheckReport,
	HealthcheckSeverity,
	HealthcheckStatus,
	isHealthcheckFixable,
} from '../healthchecks';

export async function runHealthcheck(tree: Tree, healthcheck: Healthcheck): Promise<HealthcheckReport> {
	const report: HealthcheckReport = {
		name: healthcheck.name,
		status: HealthcheckStatus.Success,
		fixable: false,
		healthcheck,
	};

	const failure: HealthcheckFailureFn = (details: string, severity: HealthcheckSeverity, fixable: boolean) => {
		// check if this issue already exists
		if (report.issues?.some((issue) => issue.details === details)) {
			return;
		}

		report.status = HealthcheckStatus.Failure;
		report.issues ??= [];
		report.issues.push({ details, severity });
		report.fixable = report.fixable || (fixable && isHealthcheckFixable(healthcheck));
	};

	const skip = (reason: string) => {
		report.status = HealthcheckStatus.Skipped;
		report.reason = reason;
	};

	await coercePromise(healthcheck.detect(tree, failure, skip));

	return report;
}

function coercePromise<T>(value: T | Promise<T>): Promise<T> {
	return value instanceof Promise ? value : Promise.resolve(value);
}
