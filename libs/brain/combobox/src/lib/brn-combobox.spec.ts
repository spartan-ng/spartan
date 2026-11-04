import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BrnOverlay } from '@spartan-ng/brain/overlay';
import { BrnPopover } from '@spartan-ng/brain/popover';
import { render, waitFor } from '@testing-library/angular';
import { BrnCombobox } from './brn-combobox';
import { BrnComboboxItem } from './brn-combobox-item';
import { BrnComboboxMultiple } from './brn-combobox-multiple';

@Component({
	selector: 'brn-combobox-items-host',
	imports: [BrnCombobox, BrnComboboxItem],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnCombobox>
			@for (item of items(); track item) {
				<div brnComboboxItem [value]="item">{{ item }}</div>
			}
		</div>
	`,
})
class ComboboxItemsHost {
	public readonly items = signal<string[]>(['Item 1']);
}

@Component({
	selector: 'brn-combobox-multiple-items-host',
	imports: [BrnComboboxMultiple, BrnComboboxItem],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnCombobox>
			@for (item of items(); track item) {
				<div brnComboboxItem [value]="item">{{ item }}</div>
			}
		</div>
	`,
})
class ComboboxMultipleItemsHost {
	public readonly items = signal<string[]>(['Item 1']);
}

const popoverStub = (state: 'open' | 'closed' = 'open') =>
	({
		stateComputed: signal(state),
		closed: { subscribe: vi.fn() },
		updatePosition: vi.fn(),
		open: vi.fn(),
		close: vi.fn(),
	}) as unknown as BrnPopover;

describe('BrnCombobox item updates', () => {
	it('updates overlay position when option items update while expanded', async () => {
		const popover = popoverStub('open');
		const view = await render(ComboboxItemsHost, {
			providers: [{ provide: BrnPopover, useValue: popover }],
		});

		(popover.updatePosition as ReturnType<typeof vi.fn>).mockClear();

		// Add items dynamically (simulating async results)
		view.fixture.componentInstance.items.set(['Item 1', 'Item 2', 'Item 3']);
		view.fixture.detectChanges();

		await waitFor(() => {
			expect(popover.updatePosition).toHaveBeenCalled();
		});
	});

	it('does not update overlay position when items update while closed', async () => {
		const popover = popoverStub('closed');
		const view = await render(ComboboxItemsHost, {
			providers: [{ provide: BrnPopover, useValue: popover }],
		});

		(popover.updatePosition as ReturnType<typeof vi.fn>).mockClear();

		view.fixture.componentInstance.items.set(['Item 1', 'Item 2']);
		view.fixture.detectChanges();

		await new Promise((resolve) => setTimeout(resolve, 50));
		expect(popover.updatePosition).not.toHaveBeenCalled();
	});

	it('calls updatePosition only once when popover and overlay resolve to the same instance', async () => {
		const popover = popoverStub('open');
		const view = await render(ComboboxItemsHost, {
			providers: [
				{ provide: BrnPopover, useValue: popover },
				{ provide: BrnOverlay, useValue: popover },
			],
		});

		(popover.updatePosition as ReturnType<typeof vi.fn>).mockClear();

		view.fixture.componentInstance.items.set(['Item 1', 'Item 2', 'Item 3']);
		view.fixture.detectChanges();

		await waitFor(() => {
			expect(popover.updatePosition).toHaveBeenCalledTimes(1);
		});
	});
});

describe('BrnComboboxMultiple item updates', () => {
	it('updates overlay position when option items update while expanded', async () => {
		const popover = popoverStub('open');
		const view = await render(ComboboxMultipleItemsHost, {
			providers: [{ provide: BrnPopover, useValue: popover }],
		});

		(popover.updatePosition as ReturnType<typeof vi.fn>).mockClear();

		view.fixture.componentInstance.items.set(['Item 1', 'Item 2', 'Item 3']);
		view.fixture.detectChanges();

		await waitFor(() => {
			expect(popover.updatePosition).toHaveBeenCalled();
		});
	});

	it('does not update overlay position when items update while closed', async () => {
		const popover = popoverStub('closed');
		const view = await render(ComboboxMultipleItemsHost, {
			providers: [{ provide: BrnPopover, useValue: popover }],
		});

		(popover.updatePosition as ReturnType<typeof vi.fn>).mockClear();

		view.fixture.componentInstance.items.set(['Item 1', 'Item 2']);
		view.fixture.detectChanges();

		await new Promise((resolve) => setTimeout(resolve, 50));
		expect(popover.updatePosition).not.toHaveBeenCalled();
	});

	it('calls updatePosition only once when popover and overlay resolve to the same instance', async () => {
		const popover = popoverStub('open');
		const view = await render(ComboboxMultipleItemsHost, {
			providers: [
				{ provide: BrnPopover, useValue: popover },
				{ provide: BrnOverlay, useValue: popover },
			],
		});

		(popover.updatePosition as ReturnType<typeof vi.fn>).mockClear();

		view.fixture.componentInstance.items.set(['Item 1', 'Item 2', 'Item 3']);
		view.fixture.detectChanges();

		await waitFor(() => {
			expect(popover.updatePosition).toHaveBeenCalledTimes(1);
		});
	});
});
