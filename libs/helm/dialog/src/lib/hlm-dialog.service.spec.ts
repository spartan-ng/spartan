import { ApplicationRef, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { render, waitFor } from '@testing-library/angular';
import type { Observable } from 'rxjs';
import { HlmDialogDescription } from './hlm-dialog-description';
import { HlmDialogService } from './hlm-dialog.service';

type SelectedUser = { id: number; name: string };
type UserDialogData = { users: SelectedUser[] };

@Component({
	selector: 'hlm-dialog-service-host',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '',
})
class DialogServiceHost {
	public readonly service = inject(HlmDialogService);
}

@Component({
	selector: 'hlm-dialog-service-content',
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<span data-testid="content">content</span>
	`,
})
class DialogServiceContent {}

@Component({
	selector: 'hlm-dialog-service-description-content',
	imports: [HlmDialogDescription],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<p hlmDialogDescription data-testid="description">Some description</p>
	`,
})
class DialogServiceDescriptionContent {}

describe('HlmDialogService typed open()', () => {
	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('returns a BrnDialogRef whose result type follows open<TResult>()', async () => {
		const view = await render(DialogServiceHost);
		const { service } = view.fixture.componentInstance;

		const dialogRef = service.open<SelectedUser, UserDialogData>(DialogServiceContent, {
			context: { users: [{ id: 1, name: 'Ada' }] },
		});

		const closed$: Observable<SelectedUser | undefined> = dialogRef.closed$;

		expect(dialogRef).toBeInstanceOf(BrnDialogRef);
		expect(closed$).toBeDefined();
	});

	it('does not throw NG0100 when the opened content registers a description and change detection runs', async () => {
		const view = await render(DialogServiceHost);
		const { service } = view.fixture.componentInstance;

		service.open(DialogServiceDescriptionContent);

		await waitFor(() => expect(document.querySelector('cdk-dialog-container')).toBeTruthy());
		expect(() => TestBed.inject(ApplicationRef).tick()).not.toThrow();
	});
});
