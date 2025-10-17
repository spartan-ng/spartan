import { githubRouter } from '@spartan-ng/app/server/trpc/routers/github';
import { router } from '../trpc';
import { noteRouter } from './notes';

export const appRouter = router({
	note: noteRouter,
	github: githubRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
