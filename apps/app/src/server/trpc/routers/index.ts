import { router } from '../trpc';
import { docsRouter } from './docs';
import { noteRouter } from './notes';

export const appRouter = router({
	note: noteRouter,
	docs: docsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
