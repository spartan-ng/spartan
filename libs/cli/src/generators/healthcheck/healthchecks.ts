import { Tree } from '@nx/devkit';

export type Healthcheck = StandardHealthcheck | FixableHealthcheck;

interface StandardHealthcheck {
	/**
	 * The name of the healthcheck.
	 */
	name: string;

	/**
	 * Determine whether or not anything in the project needs to be fixed.
	 */
	detect(tree: Tree, failure: HealthcheckFailureFn, skip: HealthcheckSkippedFn): void | Promise<void>;
}

interface FixableHealthcheck extends StandardHealthcheck {
	/**
	 * Fix any issues found by the check method. Return true if the issue was fixed, false if it was not.
	 */
	fix(tree: Tree, context: HealthcheckContext): boolean | Promise<boolean>;
	/**
	 * The auto fix prompt message.
	 */
	prompt: string;
}

export enum HealthcheckStatus {
	Success,
	Failure,
	Skipped,
}

export enum HealthcheckSeverity {
	Error,
	Warning,
}

export type HealthcheckFailureFn = (issue: string, severity: HealthcheckSeverity, fixable: boolean) => void;
export type HealthcheckSkippedFn = (reason: string) => void;

/**
 * Determine if a healthcheck is fixable.
 */
export function isHealthcheckFixable(healthcheck: Healthcheck): healthcheck is FixableHealthcheck {
	return 'fix' in healthcheck;
}

export interface HealthcheckReport {
	/**
	 * The name of the healthcheck.
	 */
	name: string;

	/**
	 * The healthcheck.
	 */
	healthcheck: Healthcheck;

	/**
	 * The status of the healthcheck.
	 */
	status: HealthcheckStatus;

	/**
	 * The list of issues that were found by the healthcheck.
	 */
	issues?: HealthcheckIssue[];

	/**
	 * If the healthcheck was skipped, this message will be displayed to the user.
	 */
	reason?: string;

	/**
	 * Whether or not the healthcheck can be fixed.
	 */
	fixable: boolean;
}

export interface HealthcheckIssue {
	/**
	 * The details of the issue that was found by the healthcheck.
	 */
	details: string;

	/**
	 * The severity of the issue.
	 */
	severity: HealthcheckSeverity;
}

interface HealthcheckContext {
	angularCli?: boolean;
}
