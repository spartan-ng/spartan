import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmAlertModule } from '@spartan-ng/ui-alert-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { hlmCode, hlmH4, hlmP } from '@spartan-ng/ui-typography-helm';
import { AccordionPreviewComponent } from '../../(components)/components/(accordion)/accordion.preview';
import { CodePreviewDirective } from '../../../shared/code/code-preview.directive';
import { CodeComponent } from '../../../shared/code/code.component';
import { MainSectionDirective } from '../../../shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '../../../shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '../../../shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '../../../shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '../../../shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '../../../shared/layout/section-sub-heading.component';
import { TabsComponent } from '../../../shared/layout/tabs.component';
import { metaWith } from '../../../shared/meta/meta.util';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Installation' },
	meta: metaWith('spartan/stack - Installation', 'Get up and running with the spartan/stack.'),
	title: 'spartan/stack - Installation',
};

@Component({
	selector: 'spartan-stack-installation',
	standalone: true,
	imports: [
		MainSectionDirective,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageNavComponent,
		CodeComponent,
		TabsComponent,
		HlmAlertModule,
		NgIcon,
		HlmIconDirective,
		HlmButtonDirective,
		AccordionPreviewComponent,
		CodePreviewDirective,
		RouterLink,
	],
	providers: [provideIcons({ lucideTriangleAlert, lucideChevronRight })],
	template: `
		<section spartanMainSection>
			<spartan-section-intro name="Installation" lead="Get up and running with the spartan/stack." />

			<spartan-section-sub-heading first id="nx">Setting up your Nx workspace</spartan-section-sub-heading>

			<p class="${hlmP}">
				The
				<code class="${hlmCode}">spartan/stack</code>
				starts with an Nx workspace. Even better, AnalogJs comes with first-class Nx support and a preset, which will
				set up our favorite meta-framework for you out of the box!
			</p>

			<p class="${hlmP}">Enter the following command:</p>

			<spartan-code class="mt-3" language="sh" code="npx create-nx-workspace@latest --preset=@analogjs/platform" />

			<p class="${hlmP}">You will be asked to choose a folder name for your workspace:</p>
			<spartan-code disableCopy class="mt-3" language="sh" code="Where would you like to create your workspace?" />
			<p class="${hlmP}">Pick whichever fits your project the best!</p>

			<p class="${hlmP}">Then, you will be prompted to answer the following questions:</p>
			<spartan-code
				disableCopy
				class="mt-3"
				language="sh"
				code="What name would you like to use for your AnalogJs app?<br>Add TailwindCSS for styling?<br>Add tRPC for typesafe client/server interaction?"
			/>
			<p class="${hlmP}">
				Give your application a meaningful name (we will refer to this as
				<code class="${hlmCode}">[YOUR_APP_NAME]</code>
				in this guide) and press
				<code class="${hlmCode}">y/Y</code>
				to answer both questions about adding TailwindCSS and tRPC to your application.
			</p>

			<spartan-section-sub-heading id="analogjs">AnalogJs, Angular, TailwindCSS, and tRPC</spartan-section-sub-heading>

			<p class="${hlmP}">
				With this simple command, you will have a working Nx workspace that includes an example AnalogJs application,
				with TailwindCSS and tRPC already set up!
			</p>

			<p class="${hlmP}">Watch the video below to become more familiar with the AnalogJs setup.</p>

			<div class="mt-3 max-w-[95vw]">
				<div style="position: relative; padding-bottom: 59.01639344262295%; height: 0;">
					<iframe
						src="https://www.loom.com/embed/1a0daf36c78f4ebcb0c8ba4694fdd0fa?sid=8634ad3b-287c-46be-8141-6eb8a52ebaf0"
						frameborder="0"
						webkitallowfullscreen
						mozallowfullscreen
						allowfullscreen
						style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
					></iframe>
				</div>
			</div>

			<spartan-section-sub-heading id="drizzle">Drizzle</spartan-section-sub-heading>
			<p class="${hlmP}">
				Currently, we use an in-memory array to store the notes of our example application. Let's persist our data in an
				actual database. To interact with our DB, we will use the Drizzle ORM. Let's first install the necessary
				dependencies:
			</p>
			<spartan-code class="mt-3" language="sh" code="npm install drizzle-orm postgres" />

			<div class="mb-6 mt-4" hlmAlert>
				<ng-icon hlm hlmAlertIcon name="lucideTriangleAlert" />
				<h4 hlmAlertTitle>Dealing with postgres & CommonJs</h4>
				<p hlmAlertDesc>
					<code class="${hlmCode}">postgres</code>
					is a CommonJs package, which directly exposes an augmented function. Therefore, we need to adjust our
					<code class="${hlmCode}">[YOUR_APP_NAME]/tsconfig.json</code>
					file to tell the TS compiler how to deal with it properly. Add the following line to
					<code class="${hlmCode}">compilerOptions</code>
					:
				</p>
				<spartan-code class="mt-3" language="sh" code='"allowSyntheticDefaultImports": true' />
			</div>

			<p class="${hlmP}">
				Finally, we need to set up our DB connection and create a typescript schema that matches our database structure.
				We will add a
				<code class="${hlmCode}">[YOUR_APP_NAME]/src/db.ts</code>
				file with the following content:
			</p>

			<spartan-code
				class="mt-3"
				language="ts"
				code="
import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import postgres from 'postgres';

export const notes = pgTable('note', {
  id: serial('id').primaryKey(),
  note: text('note').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Note = InferSelectModel<typeof notes>;
export type NewNote = InferInsertModel<typeof notes>;

const client = postgres(process.env['DATABASE_URL'] ?? '');
export const db = drizzle(client);"
			/>

			<p class="${hlmP}">
				We first declare our notes table and make Drizzle aware of all its columns and their respective types. We then
				declare some helper types we will use when retrieving and creating our Notes. Finally, we initialize our
				Postgres client and pass it to Drizzle
			</p>

			<p class="${hlmP}">
				This is where the
				<code class="${hlmCode}">spartan/stack</code>
				starts to flex its muscles. We can now use this schema in our component. Go to
				<code class="${hlmCode}">[YOUR_APP_NAME]/src/app/pages/analog-welcome.component.ts</code>
				and replace the following line:
			</p>

			<spartan-code class="mt-3" code="import { Note } from '../../note';" />

			<p class="${hlmP}">with:</p>

			<spartan-code class="mt-3" code="import { Note } from '../../db';" />

			<p class="${hlmP}">
				Excellent! We are only a few steps away from end-to-end type-safety for our Angular application. We take this
				opportunity and delete the boilerplate file:
				<code class="${hlmCode}">[YOUR_APP_NAME]/src/note.ts</code>
				.
			</p>
			<p class="${hlmP} font-semibold">Our types now come directly from our database!</p>
			<p class="${hlmP}">
				We continue and set up our backend to use Drizzle to read, create, and delete our notes. Adjust the
				<code class="${hlmCode}">[YOUR_APP_NAME]/src/server/trpc/routers/notes.ts</code>
				file to get the below output:
			</p>
			<spartan-code
				class="mt-3"
				language="ts"
				code="
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { db, notes } from '../../../db';
import { eq } from 'drizzle-orm';

export const noteRouter = router({
  create: publicProcedure
    .input(
      z.object({
        note: z.string(),
      })
    )
    .mutation(
      async ({ input }) => await db.insert(notes).values({ note: input.note }).returning()
    ),
  list: publicProcedure.query(async () => {
    const selectedNotes = await db.select().from(notes);
    return selectedNotes.map((note) => ({ ...note, id: +note.id }));
  }),
  remove: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => await db.delete(notes).where(eq(notes.id, input.id)).returning()),
});"
			/>

			<p class="${hlmP}">
				Awesome! This is all we need to persist our data. Now that we are using type-safe database interactions and also
				leverage Drizzle's generated schemas in your components only one thing is missing:
				<span class="font-semibold">A database!</span>
			</p>

			<spartan-section-sub-heading id="supabase">Supabase</spartan-section-sub-heading>
			<p class="${hlmP}">
				We will use Supabase as our database infrastructure provider. There are two ways to get up and running with
				Supabase:
			</p>

			<ol class="mb-6 ml-6 list-decimal [&>li]:ml-2 [&>li]:mt-2">
				<li>Connecting directly to your managed instance on supabase.com</li>
				<li>Locally using Docker</li>
			</ol>

			<spartan-tabs firstTab="supabase.com" secondTab="Local">
				<div class="px-4 pb-8 pt-4" firstTab>
					<h3 class="${hlmH4}">Option 1: Connecting to supabase.com instance</h3>
					<p class="${hlmP}">
						This way is super easy! Simply by creating your account, you will also have set up your first project. This
						means that you are ready to connect to your projects database already!
					</p>
					<p class="${hlmP}">
						Let's connect our application to our Supabase Postgres instance: Add a
						<code class="${hlmCode}">.env</code>
						file at the root of your Nx workspace and add the following code snippet:
					</p>

					<spartan-code
						class="mt-3"
						code='DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-SUPABASE-REFERENCE-ID].supabase.co:5432/postgres"'
					/>

					<div class="mt-4" hlmAlert>
						<ng-icon hlm name="lucideTriangleAlert" hlmAlertIcon />
						<p hlmAlertTitle>Make sure to add .env to your .gitignore file.</p>
						<p hlmAlertDescription>
							You do not want to accidentally commit your secrets to GitHub. To exclude the file from git add a new line
							to the
							<code class="${hlmCode}">.gitignore</code>
							-file and add
							<code class="${hlmCode}">.env</code>
							on a new line.
						</p>
					</div>
				</div>

				<div class="px-4 pb-8 pt-4" secondTab>
					<h3 class="${hlmH4}">Option 2: Connecting to local Supabase instance</h3>
					<p class="${hlmP}">
						Supabase also allows you to run a version of their system locally! To get up and running you can follow this
						guide! They do a great job explaining how to get started and there is plenty of resources to help you if you
						get stuck. If you want the quick and dirty way and are on a Mac. Here is what I did to get up and running:
					</p>
					<h4 class="${hlmH4} mb-2 mt-6 !text-sm">Install supabase CLI</h4>
					<spartan-code code="brew install supabase/tap/supabase" />
					<h4 class="${hlmH4} mb-2 mt-6 !text-sm">Log into CLI</h4>
					<spartan-code code="supabase login" />
					<p class="${hlmP}">
						Create your access token from
						<a hlmBtn class="px-1 text-base" variant="link" href="https://app.supabase.com/account/tokens">
							https://app.supabase.com/account/tokens
						</a>
						and paste it into your terminal window.
					</p>

					<h4 class="${hlmH4} mb-2 mt-6 !text-sm">Create Supabase project</h4>
					<spartan-code
						code="
        # if you are in the spartan directory move UP!!!
cd ..

# create your project folder
mkdir spartan-supabase

# move into the new folder
cd spartan-supabase

# start a new git repository — important, don't skip this step
git init"
					></spartan-code>

					<h4 class="${hlmH4} mb-2 mt-6 !text-sm">Start Supabase services</h4>
					<spartan-code code="supabase init" />
					<spartan-code class="mt-3" code="supabase start" />

					<div class="mt-8" hlmAlert variant="destructive">
						<ng-icon hlm hlmAlertIcon name="lucideTriangleAlert" />
						<h4 hlmAlertTitle>Important: Make sure Docker is running</h4>
						<p hlmAlertDesc>
							Make sure Docker is running and configured correctly! I had Docker already installed and running. However,
							my setup is not compatible with the config Supabase expects by default.
						</p>
					</div>

					<p class="${hlmP} mb-2">To get it to work for now I ran:</p>
					<spartan-code
						code="DOCKER_HOST=unix:///Users/[YOUR_USER_ACCOUNT_NAME]/.docker/run/docker.sock supabase start"
					/>
					<p class="${hlmP} mb-2">
						The previous step can take a while as all the docker images have to be downloaded first. However, once
						everything completes you will see a console output that looks like this:
					</p>

					<spartan-code
						disableCopy
						code="
Started Supabase local development setup.

API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
Inbucket URL: http://localhost:54324
anon key: eyJh......
service_role key: eyJh......"
					/>
					<p class="${hlmP}">
						Take your cyber-security hat off for a minute (we are working locally after all) and copy the connection
						string:
					</p>

					<spartan-code code="postgresql://postgres:postgres@localhost:54322/postgres" />

					<p class="${hlmP} mb-2">
						Add a
						<code class="${hlmCode}">.env</code>
						file at the root of your Nx workspace and add the connection string like so:
					</p>

					<spartan-code code='DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres' />
					<p class="${hlmP}">Perfect! You should be able to connect to your local Supabase Postgres instance now!</p>
				</div>
			</spartan-tabs>

			<spartan-section-sub-heading id="db-schema">Setting up the Schema</spartan-section-sub-heading>
			<p class="${hlmP}">
				While Drizzle is adding support for automatic database migrations, I like to keep them explicit and run the
				commands directly against the DB. Until spartan/stack comes with an automated solution like liquibase, let's
				manually run the following command in the SQL-Editor to create our notes table:
			</p>
			<spartan-code
				class="mt-3"
				code="
create sequence note_id_seq;

create table note (
    id bigint not null default nextval('note_id_seq'::regclass),
    note text not null,
    created_at timestamp with time zone null default current_timestamp,
    constraint notes_pkey primary key (id)
);
"
			/>

			<spartan-section-sub-heading id="local-dev">Local Development</spartan-section-sub-heading>
			<spartan-code class="mt-3" language="sh" code="npx nx serve [YOUR_APP_NAME]" />
			<p class="${hlmP}">You can now serve the local development server by running the above command.</p>

			<spartan-section-sub-heading id="production">Build for Production</spartan-section-sub-heading>
			<spartan-code class="mt-3" language="sh" code="npx nx build [YOUR_APP_NAME]" />
			<p class="${hlmP}">
				Finally, let's build a production bundle of our application. Run the command above. By default, AnalogJs will
				build a NodeJs-compatible output, which you can run with the following command:
			</p>
			<spartan-code class="mt-3" language="sh" code="node dist/[YOUR_APP_NAME]/analog/server/index.mjs" />
			<p class="${hlmP}">
				AnalogJs also supports multiple build presets, which makes it easy to deploy your application to most of the
				major cloud providers. This includes Zerops, Vercel, Cloudflare, Azure, AWS, and more.
			</p>
			<div class="mt-4 flex items-center justify-end">
				<a
					target="_blank"
					href="https://analogjs.org/docs/features/deployment/providers"
					variant="outline"
					size="sm"
					hlmBtn
				>
					Check out the AnalogJs docs for more info
					<ng-icon hlm name="lucideChevronRight" class="ml-2" size="sm" />
				</a>
			</div>

			<spartan-section-sub-heading id="next-steps">Next Steps</spartan-section-sub-heading>
			<p class="${hlmP}">
				Now that you know how to develop and build your application for production, you are ready to take it to the next
				level. Why don't you make it beautiful and accessible for everyone with spartan/ui?
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="/documentation/installation" label="spartan/ui" />
				<spartan-page-bottom-nav-link direction="previous" href="technologies" label="Technologies" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class InstallationPageComponent {}
