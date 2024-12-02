import type { ExecutorContext } from '@nx/devkit';

export function getProjectName(context: ExecutorContext): string {
	return context.projectName;
}

export function getRoot(context: ExecutorContext): string {
	const projectsConfiguration = context.projectsConfigurations.projects;
	const projectName = getProjectName(context);
	return projectsConfiguration[projectName].root;
}
