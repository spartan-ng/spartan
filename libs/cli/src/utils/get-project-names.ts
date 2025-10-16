import { type Tree, getProjects } from '@nx/devkit';

export const getProjectsAndNames = (tree: Tree) => {
	const projectNames: string[] = [];
	const projects = getProjects(tree);

	projects.forEach((projectConfiguration, projectName) => {
		if (projectConfiguration.projectType === 'application') {
			projectNames.push(projectName);
		}
	});
	return { projects, projectNames };
};
