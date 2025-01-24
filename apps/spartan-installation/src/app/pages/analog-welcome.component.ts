import { waitFor } from '@analogjs/trpc';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { shareReplay, Subject, switchMap, take } from 'rxjs';
import { Note } from '../../drizzle/schema/notes';
import { injectTrpcClient } from '../../trpc-client';

@Component({
	selector: 'spartan-installation-analog-welcome',
	standalone: true,
	imports: [AsyncPipe, FormsModule, NgFor, DatePipe, NgIf],
	host: {
		class: 'flex min-h-screen flex-col text-zinc-900 bg-zinc-50 px-4 pt-8 pb-32',
	},
	template: `
		<main class="mx-auto flex-1">
			<section class="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
				<div class="flex max-w-[64rem] flex-col items-center gap-4 text-center">
					<img
						class="h-12 w-12"
						src="https://analogjs.org/img/logos/analog-logo.svg"
						alt="AnalogJs logo. Two red triangles and a white analog wave in front"
					/>
					<a
						class="focus-visible:ring-ring rounded-2xl bg-zinc-200 px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
						target="_blank"
						href="https://twitter.com/analogjs"
					>
						Follow along on Twitter
					</a>
					<h1 class="font-heading text-3xl font-medium sm:text-5xl md:text-6xl lg:text-7xl">
						<span class="text-[#DD0031]">Analog.</span>
						The fullstack Angular meta-framework
					</h1>
					<p class="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
						Analog is for building applications and websites with Angular.
						<br />
						Powered by Vite.
					</p>
					<div class="space-x-4">
						<a
							class="focus-visible:ring-ring ring-offset-background inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-8 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-950/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							href="https://analogjs.org"
						>
							Read the docs
						</a>
						<a
							target="_blank"
							rel="noreferrer"
							class="focus-visible:ring-ring ring-offset-background border-input inline-flex h-11 items-center justify-center rounded-md border px-8 text-sm font-medium transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							href="https://github.com/analogjs/analog"
						>
							Star on GitHub
						</a>
					</div>
				</div>
			</section>
			<section id="trpc-demo" class="py-8 md:py-12 lg:py-24">
				<div class="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
					<h2 class="text-3xl font-medium leading-[1.1] text-[#DD0031]">Leave a note</h2>
					<p class="max-w-[85%] leading-normal sm:text-lg sm:leading-7">
						This is an example of how you can use tRPC to superpower your client-server interaction.
					</p>
				</div>
				<form class="mt-8 flex items-center pb-2" #f="ngForm" (ngSubmit)="addNote(f)">
					<label class="sr-only" for="newNote">Note</label>
					<input
						required
						autocomplete="off"
						name="newNote"
						[(ngModel)]="newNote"
						class="focus-visible:ring-ring ring-offset-background border-input inline-flex h-11 w-full items-center justify-center rounded-md border px-2 text-sm font-medium transition-colors hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					/>
					<button
						class="focus-visible:ring-ring ring-offset-background border-input ml-2 inline-flex h-11 items-center justify-center rounded-md border px-8 text-sm font-medium transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					>
						+
					</button>
				</form>
				<div class="mt-4" *ngIf="notes$ | async as notes; else loading">
					<div
						class="note border-input mb-4 rounded-md border p-4 font-normal"
						*ngFor="let note of notes; trackBy: noteTrackBy; let i = index"
					>
						<div class="flex items-center justify-between">
							<p class="text-sm text-zinc-400">{{ note.createdAt | date }}</p>
							<button
								[attr.data-testid]="'removeNoteAtIndexBtn' + i"
								class="focus-visible:ring-ring ring-offset-background inline-flex h-6 w-6 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
								(click)="removeNote(note.id)"
							>
								x
							</button>
						</div>
						<p class="mb-4">{{ note.note }}</p>
					</div>

					<div class="no-notes rounded-xl p-20 text-center" *ngIf="notes.length === 0">
						<h3 class="text-xl font-medium">No notes yet!</h3>
						<p class="text-zinc-400">Add a new one and see them appear here...</p>
					</div>
				</div>
				<ng-template #loading>
					<p class="mt-4 text-center">Loading...</p>
				</ng-template>
			</section>
		</main>
	`,
})
export class AnalogWelcomeComponent {
	private _trpc = injectTrpcClient();
	public triggerRefresh$ = new Subject<void>();
	public notes$ = this.triggerRefresh$.pipe(
		switchMap(() => this._trpc.note.list.query()),
		shareReplay(1),
	);
	public newNote = '';

	constructor() {
		void waitFor(this.notes$);
		this.triggerRefresh$.next();
	}

	public noteTrackBy = (index: number, note: Note) => {
		return note.id;
	};

	public addNote(form: NgForm) {
		if (!form.valid) {
			form.form.markAllAsTouched();
			return;
		}
		this._trpc.note.create
			.mutate({ note: this.newNote })
			.pipe(take(1))
			.subscribe(() => this.triggerRefresh$.next());
		this.newNote = '';
		form.form.reset();
	}

	public removeNote(id: number) {
		this._trpc.note.remove
			.mutate({ id })
			.pipe(take(1))
			.subscribe(() => this.triggerRefresh$.next());
	}
}
