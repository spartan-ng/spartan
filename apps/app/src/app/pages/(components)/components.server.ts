import manualInstallSnippets from '../../../public/data/manual-install-snippets.json';
import primitivesData from '../../../public/data/primitives-snippets.json';
import docsData from '../../../public/data/ui-api.json';

export const load = async () => {
	return { docsData, primitivesData, manualInstallSnippets };
};
