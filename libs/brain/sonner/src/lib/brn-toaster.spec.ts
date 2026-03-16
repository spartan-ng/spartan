import { ChangeDetectionStrategy, Component, input, provideZonelessChangeDetection } from '@angular/core';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { noop } from 'rxjs';
import { BrnSonnerToaster } from './brn-toaster';
import { toast, toastState } from './state';
import type { ToasterProps } from './types';

type ToastFn = (t: typeof toast) => void;

export type ToastTestInputs = {
	callback: ToastFn;
	theme?: ToasterProps['theme'];
	closeButton?: ToasterProps['closeButton'];
};

@Component({
	selector: 'brn-sonner-test',
	imports: [BrnSonnerToaster],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<brn-sonner-toaster [theme]="theme()" [closeButton]="closeButton()">
			<ng-template #successIcon>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-badge-check"
				>
					<path
						d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
					/>
					<path d="m9 12 2 2 4-4" />
				</svg>
			</ng-template>
		</brn-sonner-toaster>
		<button data-testid="trigger" (click)="onClick()">Trigger</button>
	`,
})
export class ToasterTestComponent {
	public readonly callback = input.required<ToastTestInputs['callback']>();
	public readonly theme = input<ToasterProps['theme']>('light');
	public readonly closeButton = input<ToasterProps['closeButton']>(false);

	onClick() {
		this.callback()(toast);
	}
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
async function setup(inputs: ToastTestInputs) {
	const user = userEvent.setup();
	const returned = await render(ToasterTestComponent, {
		providers: [provideZonelessChangeDetection()],
		componentInputs: inputs,
	});
	const trigger = returned.getByTestId('trigger');

	return {
		trigger,
		user,
		...returned,
	};
}

describe('Toaster', () => {
	beforeEach(() => {
		toastState.reset();
	});

	it('should render a toast', async () => {
		const { user, trigger, container, getByText } = await setup({
			callback: (toast) => toast('Hello world'),
		});

		await user.click(trigger);
		expect(getByText('Hello world')).toBeVisible();

		const toasts = Array.from(container.querySelectorAll('[data-sonner-toast]'));
		expect(toasts.length).toBe(1);
	});

	it('should show a toast with custom duration', async () => {
		const { user, trigger, queryByText } = await setup({
			callback: (toast) => toast('Custom duration', { duration: 300 }),
		});

		expect(queryByText('Custom duration')).toBeNull();

		await user.click(trigger);
		expect(queryByText('Custom duration')).not.toBeNull();

		await sleep(600);
		expect(queryByText('Custom duration')).toBeNull();
	});

	it('should reset duration on a toast update', async () => {
		const { user, trigger, getByText, queryByText } = await setup({
			callback: (toast) => {
				const id = toast('Loading', { duration: 2000 });

				setTimeout(() => {
					toast.success('Finished loading!', { id });
				}, 1500);
			},
		});

		await user.click(trigger);
		expect(getByText('Loading')).toBeVisible();
		await sleep(1500);
		expect(queryByText('Loading')).toBeNull();
		expect(getByText('Finished loading!')).toBeVisible();
		// there would only be ~.5 seconds left on the original toast
		// so we're going to wait .5 seconds to make sure the timer is reset
		await sleep(500);
		expect(getByText('Finished loading!')).toBeVisible();
		// finally we'll wait another 1500ms to make sure the toast closes after 2 seconds
		// since the original toast had a duration of 2 seconds
		await sleep(2000);
		expect(queryByText('Finished loading!')).toBeNull();
	});

	it('should allow duration updates on toast update', async () => {
		const { user, trigger, getByText, queryByText } = await setup({
			callback: (toast) => {
				const id = toast('Loading', { duration: 2000 });

				setTimeout(() => {
					toast.success('Finished loading!', { id, duration: 4000 });
				}, 1000);
			},
		});

		await user.click(trigger);
		expect(getByText('Loading')).toBeVisible();
		await sleep(1200);
		expect(queryByText('Loading')).toBeNull();
		expect(getByText('Finished loading!')).toBeVisible();
		await sleep(2200);
		expect(getByText('Finished loading!')).toBeVisible();
	});

	it('should show correct toast content based on promise state', async () => {
		const { user, trigger, queryByText, getByText } = await setup({
			callback: (toast) =>
				toast.promise<string>(
					() =>
						new Promise((resolve) =>
							setTimeout(() => {
								resolve('Loaded');
							}, 2000),
						),
					{
						loading: 'Loading...',
						success: (data) => data,
						error: 'Error',
					},
				),
		});

		await user.click(trigger);
		expect(getByText('Loading...')).toBeVisible();
		await sleep(2000);
		expect(queryByText('Loading...')).toBeNull();
		expect(getByText('Loaded')).toBeVisible();
	});

	it('should focus the toast when hotkey is pressed', async () => {
		const { user, trigger, getByText } = await setup({
			callback: (toast) => toast('Hello world', { duration: 5000 }),
		});

		await user.click(trigger);
		expect(getByText('Hello world')).toBeVisible();

		await user.keyboard('{Alt>}T{/Alt}');
		await sleep(100);
		expect(document.activeElement).toBeInstanceOf(HTMLOListElement);
	});

	it('should not immediately close the toast when reset', async () => {
		const { user, trigger, getByText, queryByText } = await setup({
			callback: (toast) => {
				const id = toast('Loading', { duration: 4000 });

				setTimeout(() => {
					toast.success('Finished loading!', { id });
				}, 1000);
			},
		});

		await user.click(trigger);
		expect(getByText('Loading')).toBeVisible();
		await sleep(2050);
		expect(queryByText('Loading')).toBeNull();
		expect(getByText('Finished loading!')).toBeVisible();
		await sleep(1000);
		expect(getByText('Finished loading!')).toBeVisible();
	});

	it('should render toast with custom class', async () => {
		const { user, trigger, container } = await setup({
			callback: (toast) =>
				toast('Hello world', {
					classes: {
						toast: 'test-class',
					},
				}),
		});

		await user.click(trigger);
		const toast = container.querySelector('[data-sonner-toast]');
		expect(toast).not.toBeNull();
		expect(toast as Element).toHaveClass('test-class');
	});

	it('should render cancel button custom styles', async () => {
		const { user, trigger, container } = await setup({
			callback: (toast) =>
				toast('Hello world', {
					cancel: {
						label: 'Cancel',
					},
					cancelButtonStyle: 'background-color: rgb(254, 226, 226)',
				}),
		});

		await user.click(trigger);
		const cancelButton = container.querySelector('[data-cancel]');
		expect(cancelButton).not.toBeNull();
		expect(cancelButton as Element).toHaveStyle('background-color: rgb(254, 226, 226)');
	});

	it('should render action button custom styles', async () => {
		const { user, trigger, container } = await setup({
			callback: (toast) =>
				toast('Hello world', {
					action: {
						label: 'Do something',
						onClick: noop,
					},
					actionButtonStyle: 'background-color: rgb(219, 239, 255)',
				}),
		});

		await user.click(trigger);
		const actionButton = container.querySelector('[data-button]');
		expect(actionButton).not.toBeNull();
		expect(actionButton as Element).toHaveStyle('background-color: rgb(219, 239, 255)');
	});

	it('should reflect toaster dark theme correctly', async () => {
		const { user, trigger, container } = await setup({
			callback: (toast) => toast('Hello world'),
			theme: 'dark',
		});

		await user.click(trigger);
		const toaster = container.querySelector('[data-sonner-toaster]');
		expect(toaster).not.toBeNull();
		expect(toaster as Element).toHaveAttribute('data-theme', 'dark');
	});

	it('should show close button correctly', async () => {
		const { user, trigger, container } = await setup({
			callback: (toast) => toast('Hello world'),
			closeButton: true,
		});

		await user.click(trigger);
		const closeButton = container.querySelector('[data-close-button]');
		expect(closeButton).not.toBeNull();
	});

	it('should not show close button if the toast has closeButton false', async () => {
		const { user, trigger, container } = await setup({
			callback: (toast) => toast('Hello world', { closeButton: false }),
			closeButton: true,
		});

		await user.click(trigger);
		const closeButton = container.querySelector('[data-close-button]');
		expect(closeButton).toBeNull();
	});

	it('should show close button if the toast has closeButton true', async () => {
		const { user, trigger, container } = await setup({
			callback: (toast) => toast('Hello world', { closeButton: true }),
			closeButton: false,
		});

		await user.click(trigger);
		const closeButton = container.querySelector('[data-close-button]');
		expect(closeButton).not.toBeNull();
	});

	it('should render the custom icon when provided', async () => {
		const { user, trigger, container } = await setup({
			callback: (toast) => toast.success('Hello world'),
		});
		await user.click(trigger);
		const icon = container.querySelector('[data-icon]');
		expect(icon).not.toBeNull();
		expect(icon).toContainHTML(
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-check"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m9 12 2 2 4-4" /></svg>',
		);
	});
});
