import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { render } from '@testing-library/angular';
import { BrnSelectItem } from './brn-select-item';
import { BrnSelectMultiple } from './brn-select-multiple';

@Component({
	imports: [BrnSelectMultiple, BrnSelectItem],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnSelectMultiple>
			<div brnSelectItem value="apple">Apple</div>
			<div brnSelectItem value="banana">Banana</div>
			<div brnSelectItem value="cherry">Cherry</div>
			<div brnSelectItem value="durian" disabled>Durian</div>
		</div>
	`,
})
class BrnSelectMultipleSpec {
	public readonly select = viewChild.required(BrnSelectMultiple);
}

@Component({
	imports: [BrnSelectMultiple],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div brnSelectMultiple></div>
	`,
})
class BrnSelectMultipleEmptySpec {
	public readonly select = viewChild.required(BrnSelectMultiple);
}

describe('BrnSelectMultiple bulk selection', () => {
	const setup = async () => {
		const { fixture } = await render(BrnSelectMultipleSpec);
		const select = fixture.componentInstance.select() as BrnSelectMultiple<string>;
		const onChange = vi.fn();
		select.registerOnChange(onChange);
		return { fixture, select, onChange };
	};

	describe('selectAll', () => {
		it('selects every enabled item value with a single change emission', async () => {
			const { select, onChange } = await setup();

			select.selectAll();

			expect(select.value()).toEqual(['apple', 'banana', 'cherry']);
			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(['apple', 'banana', 'cherry']);
		});

		it('preserves selected values that have no matching item', async () => {
			const { select, onChange } = await setup();
			select.writeValue(['grape']);

			select.selectAll();

			expect(select.value()).toEqual(['grape', 'apple', 'banana', 'cherry']);
			expect(onChange).toHaveBeenCalledTimes(1);
		});

		it('skips disabled items', async () => {
			const { select } = await setup();

			select.selectAll();

			expect(select.value()).not.toContain('durian');
		});

		it('preserves the value of a selected but disabled item', async () => {
			const { select } = await setup();
			select.writeValue(['durian']);

			select.selectAll();

			expect(select.value()).toEqual(['durian', 'apple', 'banana', 'cherry']);
		});

		it('is a no-op when all enabled items are already selected', async () => {
			const { select, onChange } = await setup();
			select.writeValue(['apple', 'banana', 'cherry']);

			select.selectAll();

			expect(select.value()).toEqual(['apple', 'banana', 'cherry']);
			expect(onChange).not.toHaveBeenCalled();
		});
	});

	describe('deselectAll', () => {
		it('removes enabled item values, keeping unknown values, and notifies once', async () => {
			const { select, onChange } = await setup();
			select.writeValue(['apple', 'grape']);

			select.deselectAll();

			expect(select.value()).toEqual(['grape']);
			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(['grape']);
		});

		it('preserves the value of a selected but disabled item', async () => {
			const { select } = await setup();
			select.writeValue(['durian', 'apple']);

			select.deselectAll();

			expect(select.value()).toEqual(['durian']);
		});

		it('is a no-op when the value is already empty', async () => {
			const { select, onChange } = await setup();

			select.deselectAll();

			expect(onChange).not.toHaveBeenCalled();
		});
	});

	describe('toggleAll', () => {
		it('selects all enabled items, then clears the selection', async () => {
			const { select } = await setup();

			select.toggleAll();
			expect(select.value()).toEqual(['apple', 'banana', 'cherry']);

			select.toggleAll();
			expect(select.value()).toEqual([]);
		});
	});

	describe('allSelected / partiallySelected', () => {
		it('reports allSelected ignoring disabled items and unknown values', async () => {
			const { select } = await setup();
			select.writeValue(['apple', 'banana', 'cherry', 'grape']);

			expect(select.allSelected()).toBe(true);
			expect(select.partiallySelected()).toBe(false);
		});

		it('is false when there are no items', async () => {
			const { fixture } = await render(BrnSelectMultipleEmptySpec);
			const select = fixture.componentInstance.select() as BrnSelectMultiple<string>;

			expect(select.allSelected()).toBe(false);
			expect(select.partiallySelected()).toBe(false);
		});

		it('reports partiallySelected when some but not all enabled items are selected', async () => {
			const { select } = await setup();
			select.writeValue(['apple']);

			expect(select.allSelected()).toBe(false);
			expect(select.partiallySelected()).toBe(true);
		});

		it('flips to partiallySelected when a single item is deselected', async () => {
			const { select } = await setup();
			select.selectAll();
			expect(select.allSelected()).toBe(true);

			select.select('banana');

			expect(select.allSelected()).toBe(false);
			expect(select.partiallySelected()).toBe(true);
		});
	});
});
