import type { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { ArchitectureDiagramAnalogComponent } from '@spartan-ng/app/app/pages/(stack)/stack/(technologies)/components/architecture-diagram-analog.component';
import { ArchitectureDiagramAngularComponent } from '@spartan-ng/app/app/pages/(stack)/stack/(technologies)/components/architecture-diagram-angular.component';
import { ArchitectureDiagramDrizzleComponent } from '@spartan-ng/app/app/pages/(stack)/stack/(technologies)/components/architecture-diagram-drizzle.component';
import { ArchitectureDiagramNxComponent } from '@spartan-ng/app/app/pages/(stack)/stack/(technologies)/components/architecture-diagram-nx.component';
import { ArchitectureDiagramSupabaseComponent } from '@spartan-ng/app/app/pages/(stack)/stack/(technologies)/components/architecture-diagram-supabase.component';
import { ArchitectureDiagramTrpcComponent } from '@spartan-ng/app/app/pages/(stack)/stack/(technologies)/components/architecture-diagram-trpc.component';
import { MainSectionDirective } from '@spartan-ng/app/app/shared/layout/main-section.directive';
import { PageBottomNavLinkComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav-link.component';
import { PageBottomNavComponent } from '@spartan-ng/app/app/shared/layout/page-bottom-nav/page-bottom-nav.component';
import { PageNavComponent } from '@spartan-ng/app/app/shared/layout/page-nav/page-nav.component';
import { SectionIntroComponent } from '@spartan-ng/app/app/shared/layout/section-intro.component';
import { SectionSubHeadingComponent } from '@spartan-ng/app/app/shared/layout/section-sub-heading.component';
import { metaWith } from '@spartan-ng/app/app/shared/meta/meta.util';
import { hlmCode, hlmP } from '@spartan-ng/ui-typography-helm';

export const routeMeta: RouteMeta = {
	data: { breadcrumb: 'Technologies' },
	meta: metaWith('spartan/stack - Technologies', 'The spartan/stack'),
	title: 'spartan/stack - Technologies',
};

@Component({
	selector: 'spartan-technologies',
	imports: [
		MainSectionDirective,
		SectionIntroComponent,
		SectionSubHeadingComponent,
		PageBottomNavComponent,
		PageBottomNavLinkComponent,
		PageNavComponent,
		ArchitectureDiagramAngularComponent,
		ArchitectureDiagramAnalogComponent,
		ArchitectureDiagramTrpcComponent,
		ArchitectureDiagramDrizzleComponent,
		ArchitectureDiagramSupabaseComponent,
		ArchitectureDiagramNxComponent,
	],
	template: `
		<section spartanMainSection>
			<spartan-section-intro
				name="Technologies"
				lead="The spartan/stack is an opinionated full-stack that consists of
      multiple technologies providing e2e type safety to Angular developers."
			/>

			<spartan-section-sub-heading first id="nx">Nx</spartan-section-sub-heading>
			<spartan-architecture-diagram-nx />
			<p class="${hlmP}">
				Let's start with the workspace. The location where your code will reside and the features that meet the needs of
				your users will be implemented.
			</p>
			<p class="${hlmP}">
				Nx is a next-generation build system that offers first-class monorepo support and strong integrations for all
				well-known JavaScript frameworks. It enables you to use frontend frameworks like Angular or backend frameworks
				like NestJs to architect, test, and build your project at any size.
			</p>

			<spartan-section-sub-heading id="analogjs">AnalogJs</spartan-section-sub-heading>
			<spartan-architecture-diagram-analog />
			<p class="${hlmP}">
				AnalogJs is a meta-framework for Angular. It provides you with all the benefits of Angular but extends its
				capabilities with even more:
			</p>

			<p class="${hlmP}">
				AnalogJs uses Vite for serving and building as well as Vitest for testing. Vite is a next-generation JavaScript
				bundler that is super fast. It also gives us access to the Vite ecosystem with hundreds of very powerful
				plugins.
			</p>

			<p class="${hlmP}">
				Another incredible advantage of AnalogJs is that it comes equipped to handle both Server-Side Rendering (SSR)
				and Static Site Generation (SSG) for Angular applications. With AnalogJs, Angular can easily power marketing
				websites, blog pages, and more! As AnalogJs is SSR by default, no further configuration is necessary.
			</p>
			<p class="${hlmP}">
				Last but not least, AnalogJs supports API (server) routes and file-based routing for Angular apps. In an
				AnalogJs application, the folder hierarchy and filenames determine the routing. You won't ever need to declare a
				route array again.
			</p>

			<spartan-section-sub-heading id="angular">Angular</spartan-section-sub-heading>
			<spartan-architecture-diagram-angular />
			<p class="${hlmP}">
				Angular has opinionated routing solutions, a strong HttpClient for making asynchronous web queries, and, my
				personal favorite, an outstanding dependency injection system. Angular provides programmers with all the
				resources they need to create outstanding applications right out of the box.
			</p>

			<spartan-section-sub-heading id="trpc">tRPC</spartan-section-sub-heading>
			<spartan-architecture-diagram-trpc />
			<p class="${hlmP}">
				tRPC stands for TypeScript Remote Procedure Call, and is a lightweight library for remotely calling backend
				functions on the client side. It makes communication between the backend and frontend incredibly easy, taking
				advantage of TypeScript inference to automatically warn you of errors on your client before you even save the
				change on your server file! Using tRPC will feel like using an SDK for your API's server code, giving you
				confidence in your endpoints.
			</p>

			<spartan-section-sub-heading id="drizzle">Drizzle</spartan-section-sub-heading>
			<spartan-architecture-diagram-drizzle />
			<p class="${hlmP}">
				We're just a few steps away from having complete type safety from our database to the template generating the
				DOM. Drizzle is the tool that will bring us there. Drizzle is a Node.js and TypeScript ORM. It allows you to
				create performant SQL queries with autocompletion powered by TypeScript. They also have incredible memes!
			</p>

			<spartan-section-sub-heading id="supabase">Supabase</spartan-section-sub-heading>
			<spartan-architecture-diagram-supabase />
			<p class="${hlmP}">
				PostgreSQL is one of the world's most scalable databases. It is a sophisticated object-relational system
				applying SQL. Postgres allows you to securely store vast quantities of complex data. It enables developers to
				build the most sophisticated programs, carry out administrative operations, and establish integral environments.
				It is an open-source technology trusted by millions of developers.
			</p>
			<p class="${hlmP}">
				It turns out that every Supabase project is powered by a dedicated PostgreSQL database. Supabase is a fantastic
				open-source Firebase replacement powered by the aforementioned Postgres database. It also provides a lot more
				features as your project expands and becomes more involved.
			</p>

			<spartan-section-sub-heading id="tailwind">TailwindCSS</spartan-section-sub-heading>
			<p class="${hlmP}">
				Finally, every good application needs a great UI. Although it's easier said than done, there are tools that help
				us do our best work. Tailwind is one of those essential tools for me. Tailwind is "a utility-first CSS framework
				packed with classes like
				<code class="${hlmCode}">flex</code>
				,
				<code class="${hlmCode}">pt-4</code>
				,
				<code class="${hlmCode}">text-center</code>
				and
				<code class="${hlmCode}">rotate-90</code>
				."
			</p>
			<p class="${hlmP}">
				These utility classes let you modify the layout, color, spacing, font, shadows, and more to create a distinctive
				component design without leaving your HTML or adding any additional CSS code.
			</p>

			<spartan-page-bottom-nav>
				<spartan-page-bottom-nav-link href="installation" label="Installation" />
				<spartan-page-bottom-nav-link direction="previous" href="overview" label="Overview" />
			</spartan-page-bottom-nav>
		</section>
		<spartan-page-nav />
	`,
})
export default class AccordionPageComponent {}
