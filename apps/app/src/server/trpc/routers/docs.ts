import { ComponentApiData } from '@spartan-ng/app/app/core/models/ui-docs.model';
import docsData from '../../../public/data/ui-api.json';
import { publicProcedure, router } from '../trpc';

export const docsRouter = router({
	list: publicProcedure.query(async () => {
		return docsData as unknown as ComponentApiData;
	}),
});
