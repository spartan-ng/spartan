import type { RouteMeta } from '@analogjs/router';

import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { HlmSpinnerComponent } from '@spartan-ng/helm/spinner';
import { waitFor } from '@spartan-ng/trpc';
import { SignalFormBuilder, SignalInputDirective, V, withErrorComponent } from 'ng-signal-forms';
import { Observable, Subject, of } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import type { Note } from '../../../../../db';
import { injectTRPCClient } from '../../../../../trpc-client';
import { InputErrorComponent } from '../../../../shared/input-error/input-error.component';
import { metaWith } from '../../../../shared/meta/meta.util';
import { NoteSkeletonComponent } from './components/note-skeleton.component';
import { NoteComponent } from './components/note.component';
import { NotesEmptyComponent } from './components/notes-empty.component';

export const routeMeta: RouteMeta = {
	meta: metaWith('spartan/examples - Notes', 'A notes example displaying the SPARTAN stack and new UI primitives'),
	title: 'spartan/examples - Notes',
};

@Component({
	selector: 'spartan-notes-example',
	imports: [
		FormsModule,
		SignalInputDirective,
		HlmButtonDirective,
		HlmLabelDirective,
		HlmInputDirective,
		NoteComponent,
		NoteSkeletonComponent,
		NotesEmptyComponent,
		HlmSpinnerComponent,
	],
	providers: [withErrorComponent(InputErrorComponent)],
	host: {
		class: 'block p-2 sm:p-4 pb-16',
	},
	template: `
		<form class="flex flex-col items-end py-2">
			<label hlmLabel class="w-full">
				Title
				<input
					class="mt-1.5 w-full"
					placeholder="Buy groceries"
					hlmInput
					autocomplete="off"
					name="newTitle"
					ngModel
					[formField]="form.controls.title"
				/>
			</label>

			<label hlmLabel class="w-full">
				Content
				<textarea
					class="mt-1.5 h-fit w-full"
					placeholder="2x eggs, 1x milk,..."
					hlmInput
					autocomplete="off"
					name="newContent"
					ngModel
					rows="4"
					[formField]="form.controls.content"
				></textarea>
			</label>

			<button hlmBtn [disabled]="createLoad()" variant="secondary" (click)="createNote()">
				<span>{{ createLoad() ? 'Creating' : 'Create' }} Note</span>
				@if (createLoad()) {
					<hlm-spinner class="ml-2" size="sm" />
				}
			</button>
		</form>
		<div class="flex flex-col space-y-4 pb-12 pt-4">
			@if (showNotesArray()) {
				@for (note of state().notes ?? []; track noteTrackBy($index, note)) {
					<analog-trpc-note
						[note]="note"
						[deletionInProgress]="deleteIdInProgress() === note.id"
						(deleteClicked)="deleteNote(note.id)"
					/>
				}
				@if (noNotes()) {
					<analog-trpc-notes-empty class="border-transparent shadow-none"></analog-trpc-notes-empty>
				}
			}

			@if (initialLoad() || createLoad()) {
				<analog-trpc-note-skeleton />
			}
		</div>
	`,
})
export default class NotesExamplePageComponent {
	private readonly _trpc = injectTRPCClient();
	private readonly _sfb = inject(SignalFormBuilder);
	private readonly _refreshNotes$ = new Subject<void>();
	private readonly _notes$ = this._refreshNotes$.pipe(
		switchMap(() => this._trpc.note.list.query()),
		tap((result) =>
			this.state.update((state) => ({
				...state,
				status: 'success',
				notes: result,
				error: null,
			})),
		),
		catchError((err) => {
			this.state.update((state) => ({
				...state,
				notes: [],
				status: 'error',
				error: err,
			}));
			return of([]);
		}),
	);

	public state = signal<{
		status: 'idle' | 'loading' | 'success' | 'error';
		notes: Note[];
		error: unknown | null;
		updatedFrom: 'initial' | 'create' | 'delete';
		idBeingDeleted?: number;
	}>({
		status: 'idle',
		notes: [],
		error: null,
		updatedFrom: 'initial',
	});
	public initialLoad = computed(() => this.state().status === 'loading' && this.state().updatedFrom === 'initial');
	public createLoad = computed(() => this.state().status === 'loading' && this.state().updatedFrom === 'create');
	public deleteIdInProgress = computed(() =>
		this.state().status === 'loading' && this.state().updatedFrom === 'delete'
			? this.state().idBeingDeleted
			: undefined,
	);
	public noNotes = computed(() => this.state().notes.length === 0);
	public showNotesArray = computed(
		() => this.state().updatedFrom === 'delete' || this.state().notes.length > 0 || this.state().status === 'success',
	);

	public form = this._sfb.createFormGroup(() => ({
		title: this._sfb.createFormField<string>('', {
			validators: [
				{
					validator: V.required(),
					message: () => 'Make sure to give your note a title',
				},
			],
		}),
		content: this._sfb.createFormField('', {
			validators: [
				{
					validator: V.required(),
					message: () => 'Add some content to your note',
				},
			],
		}),
	}));

	constructor() {
		this._notes$.subscribe();
		void waitFor(this._notes$);
		this.updateNotes('initial');
	}

	public noteTrackBy = (_index: number, note: Note) => {
		return note.id;
	};

	public createNote() {
		if (this.form.state() !== 'VALID') {
			this.form.markAllAsTouched();
			return;
		}
		const { title, content } = this.form.value();
		this.updateNotes('create', this._trpc.note.create.mutate({ title, content }));
		this.form.reset();
	}

	public deleteNote(id: number) {
		this.updateNotes('delete', this._trpc.note.remove.mutate({ id }), id);
	}

	private updateNotes(
		updatedFrom: 'initial' | 'create' | 'delete',
		operation?: Observable<Note | Note[]>,
		idBeingDeleted?: number,
	) {
		this.state.update((state) => ({
			status: 'loading',
			notes: state.notes,
			error: null,
			updatedFrom,
			idBeingDeleted,
		}));
		if (!operation) {
			this._refreshNotes$.next();
			return;
		}
		operation.pipe(take(1)).subscribe(() => this._refreshNotes$.next());
	}
}
