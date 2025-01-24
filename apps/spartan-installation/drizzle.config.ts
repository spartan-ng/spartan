import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './src/drizzle/migrations',
	schema: './src/drizzle/schema/*',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env['DATABASE_URL']!,
	},
});
