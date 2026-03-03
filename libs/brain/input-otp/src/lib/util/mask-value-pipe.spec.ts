import { TestBed } from '@angular/core/testing';
import { MaskValuePipe } from './mask-value-pipe';
import { ChangeDetectorRef } from '@angular/core';

describe('MaskValuePipe', () => {
	let pipe: MaskValuePipe;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				MaskValuePipe,
				{ provide: ChangeDetectorRef, useValue: { markForCheck: jest.fn() } },
			],
		});
		pipe = TestBed.inject(MaskValuePipe);
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('creates an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('returns original value when mask is omitted (defaults to false)', () => {
		expect(pipe.transform('7')).toBe('7');
	});

	it('returns original value when mask is false', () => {
		expect(pipe.transform('7', false)).toBe('7');
		expect(pipe.transform(7, false)).toBe(7);
	});

	it('returns original value immediately, then masks after default delay when mask is true', () => {
		expect(pipe.transform('7', true)).toBe('7');

		jest.advanceTimersByTime(199);
		expect(pipe.transform('7', true)).toBe('7');

		jest.advanceTimersByTime(1);
		expect(pipe.transform('7', true)).toBe('\u2217');
	});

	it('respects custom delay', () => {
		expect(pipe.transform('7', true, 50)).toBe('7');

		jest.advanceTimersByTime(49);
		expect(pipe.transform('7', true, 50)).toBe('7');

		jest.advanceTimersByTime(1);
		expect(pipe.transform('7', true, 50)).toBe('\u2217');
	});

	it('returns original value when mask is true but value is falsy', () => {
		expect(pipe.transform('', true)).toBe('');
		expect(pipe.transform(0, true)).toBe(0);
		expect(pipe.transform(false, true)).toBe(false);
		expect(pipe.transform(null, true)).toBeNull();
		expect(pipe.transform(undefined, true)).toBeUndefined();
	});
});
