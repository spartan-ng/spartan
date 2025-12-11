import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export const notes = pgTable('note', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	content: text('content'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Note = InferSelectModel<typeof notes>;
export type NewNote = InferInsertModel<typeof notes>;

const client = postgres(process.env['DATABASE_URL'] ?? '');
export const db = drizzle(client);
