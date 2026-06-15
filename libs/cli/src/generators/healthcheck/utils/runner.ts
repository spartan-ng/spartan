import type { Tree } from '@nx/devkit';
import {
	type Healthcheck,
	type HealthcheckFailureFn,
	type HealthcheckReport,
	HealthcheckSeverity,
	HealthcheckStatus,
	isHealthcheckFixable,
} from '../healthchecks';

export async function runHealthcheck(
	tree: Tree,
	healthcheck: Healthcheck,
	importAlias: string,
): Promise<HealthcheckReport> {
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

	try {
		await coercePromise(healthcheck.detect(tree, failure, skip, { importAlias }));
	} catch (error) {
		// A single check throwing (a parse error, a network failure, a malformed file) must not abort
		// the remaining healthchecks - surface it as a failure and keep going.
		const message = error instanceof Error ? error.message : String(error);
		failure(`Healthcheck threw an unexpected error: ${message}`, HealthcheckSeverity.Error, false);
	}

	return report;
}

function coercePromise<T>(value: T | Promise<T>): Promise<T> {
	return value instanceof Promise ? value : Promise.resolve(value);
}
