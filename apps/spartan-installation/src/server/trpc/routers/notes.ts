import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../../../drizzle/db';
import { notes } from '../../../drizzle/schema/notes';
import { publicProcedure, router } from '../trpc';

export const noteRouter = router({
	create: publicProcedure
		.input(
			z.object({
				note: z.string(),
			}),
		)
		.mutation(async ({ input }) => await db.insert(notes).values({ note: input.note }).returning()),
	list: publicProcedure.query(async () => await db.select().from(notes)),
	remove: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.mutation(async ({ input }) => await db.delete(notes).where(eq(notes.id, input.id)).returning()),
});
