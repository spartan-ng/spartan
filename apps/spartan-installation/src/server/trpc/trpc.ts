import { initTRPC } from '@trpc/server';
import { SuperJSON } from 'superjson';
import { Context } from './context';

const t = initTRPC.context<Context>().create({
	transformer: SuperJSON,
});
/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;
export const router = t.router;
export const middleware = t.middleware;
