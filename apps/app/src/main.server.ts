import '@angular/platform-server/init';
import 'zone.js/node';

import { provideServerContext } from '@analogjs/router/server';
import type { ServerContext } from '@analogjs/router/tokens';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';
import { config } from './app.config.server';
import { App } from './app/app';

if (import.meta.env.PROD) {
	enableProdMode();
}
const bootstrap = () => bootstrapApplication(App, config);
export default async function render(url: string, document: string, serverContext: ServerContext) {
	const html = await renderApplication(bootstrap, {
		document,
		url,
		platformProviders: [provideServerContext(serverContext)],
	});

	return html;
}
