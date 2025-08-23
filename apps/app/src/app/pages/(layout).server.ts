import githubRepoData from '../../public/data/github-repo.json';

export const load = async () => {
	return githubRepoData || null;
};
