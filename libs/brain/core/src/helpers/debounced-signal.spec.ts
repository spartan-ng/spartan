import { signal } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { debouncedSignal } from './debounced-signal';

describe(debouncedSignal.name, () => {
	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	describe('with static delay', () => {
		it('should return initial value immediately', () => {
			TestBed.runInInjectionContext(() => {
				const source = signal('initial');
				const debounced = debouncedSignal(source, 100);

				expect(debounced()).toBe('initial');
			});
		});

		it('should debounce value changes', fakeAsync(() => {
			TestBed.runInInjectionContext(() => {
				const source = signal('initial');
				const debounced = debouncedSignal(source, 100);

				source.set('changed');

				// Value should not have changed yet
				expect(debounced()).toBe('initial');

				tick(50);
				expect(debounced()).toBe('initial');

				tick(50);
				expect(debounced()).toBe('changed');
			});
		}));

		it('should reset debounce timer on rapid changes', fakeAsync(() => {
			TestBed.runInInjectionContext(() => {
				const source = signal('initial');
				const debounced = debouncedSignal(source, 100);

				source.set('first');
				tick(50);

				source.set('second');
				tick(50);

				// Still waiting for debounce
				expect(debounced()).toBe('initial');

				tick(50);
				expect(debounced()).toBe('second');
			});
		}));
	});

	describe('with reactive delay (Signal)', () => {
		it('should return initial value immediately', () => {
			TestBed.runInInjectionContext(() => {
				const source = signal('initial');
				const delay = signal(100);
				const debounced = debouncedSignal(source, delay);

				expect(debounced()).toBe('initial');
			});
		});

		it('should debounce using the current delay value', fakeAsync(() => {
			TestBed.runInInjectionContext(() => {
				const source = signal('initial');
				const delay = signal(200);
				const debounced = debouncedSignal(source, delay);

				source.set('changed');

				tick(100);
				expect(debounced()).toBe('initial');

				tick(100);
				expect(debounced()).toBe('changed');
			});
		}));

		it('should react to delay signal changes', fakeAsync(() => {
			TestBed.runInInjectionContext(() => {
				const source = signal('initial');
				const delay = signal(500);
				const debounced = debouncedSignal(source, delay);

				// Change delay to a shorter value
				delay.set(100);
				tick(0); // Allow signal propagation

				source.set('changed');

				tick(100);
				expect(debounced()).toBe('changed');
			});
		}));

		it('should preserve initial source value when no default provided', () => {
			TestBed.runInInjectionContext(() => {
				const source = signal('Some Value');
				const delay = signal(100);
				const debounced = debouncedSignal(source, delay);

				// Initial value should be preserved, not reset
				expect(debounced()).toBe('Some Value');
			});
		});
	});
});
