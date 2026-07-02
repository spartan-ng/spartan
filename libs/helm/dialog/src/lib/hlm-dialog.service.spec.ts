import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { render } from '@testing-library/angular';
import type { Observable } from 'rxjs';
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
});
