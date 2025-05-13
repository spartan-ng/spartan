import { PageServerLoad } from '@analogjs/router';

export const load = async ({ fetch }: PageServerLoad) => {
	return await fetch('/api/primitive-api');
};
