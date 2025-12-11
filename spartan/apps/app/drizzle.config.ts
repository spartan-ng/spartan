// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './apps/app/drizzle',
	dialect: 'postgresql',
	schema: './apps/app/src/db.ts',

	dbCredentials: {
		url: `${process.env['DATABASE_URL']}`,
	},
});
