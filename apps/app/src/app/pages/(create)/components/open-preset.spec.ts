import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vitest } from 'vitest';
import { OpenPresetDialog } from './open-preset';

describe('OpenPresetDialog', () => {
	let originalMatchMedia: PropertyDescriptor | undefined;
	let originalScrollIntoView: typeof Element.prototype.scrollIntoView | undefined;
	let originalLocalStorage: PropertyDescriptor | undefined;

	beforeAll(() => {
		originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
		originalScrollIntoView = Element.prototype.scrollIntoView;
		originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
	});

	afterAll(() => {
		if (originalMatchMedia) {
			Object.defineProperty(window, 'matchMedia', originalMatchMedia);
		}
		if (originalScrollIntoView) {
			Element.prototype.scrollIntoView = originalScrollIntoView;
		}
		if (originalLocalStorage) {
			Object.defineProperty(globalThis, 'localStorage', originalLocalStorage);
		}
	});

	beforeEach(async () => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: vitest.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				addEventListener: vitest.fn(),
				removeEventListener: vitest.fn(),
				dispatchEvent: vitest.fn(),
			})),
		});
		Element.prototype.scrollIntoView = vitest.fn();
		Object.defineProperty(globalThis, 'localStorage', {
			writable: true,
			value: {
				getItem: vitest.fn(),
				setItem: vitest.fn(),
				removeItem: vitest.fn(),
			},
		});

		await TestBed.configureTestingModule({
			providers: [provideRouter([]), provideHttpClient()],
			imports: [OpenPresetDialog],
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(OpenPresetDialog);
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should render the dialog when open', async () => {
		const fixture = TestBed.createComponent(OpenPresetDialog);
		fixture.componentRef.setInput('open', 'open');
		fixture.detectChanges();
		await fixture.whenStable();
		const title = document.body.querySelector('h3');
		expect(title?.textContent?.trim()).toBe('Open Preset');
		const input = document.body.querySelector<HTMLInputElement>('#preset-code');
		expect(input).toBeTruthy();
		const applyButton = Array.from(document.body.querySelectorAll('button')).find((b) =>
			b.textContent?.trim().includes('Apply'),
		);
		expect(applyButton).toBeTruthy();
	});

	it('should show error for invalid preset code', () => {
		const fixture = TestBed.createComponent(OpenPresetDialog);
		fixture.componentRef.setInput('open', 'open');
		fixture.detectChanges();
		const component = fixture.componentInstance;
		const ctx = { close: vitest.fn() };
		component['_inputValue'].set('invalid');
		component['_apply'](ctx);
		fixture.detectChanges();
		expect(component['_error']()).toBe('Invalid preset code. Must start with "b" (e.g., b0).');
		expect(ctx.close).not.toHaveBeenCalled();
	});

	it('should emit apply output for valid preset code', () => {
		const fixture = TestBed.createComponent(OpenPresetDialog);
		fixture.componentRef.setInput('open', 'open');
		fixture.detectChanges();
		const component = fixture.componentInstance;
		const applySpy = vitest.fn();
		fixture.componentInstance.apply.subscribe(applySpy);
		const ctx = { close: vitest.fn() };
		component['_inputValue'].set('b0');
		component['_apply'](ctx);
		expect(applySpy).toHaveBeenCalledWith('b0');
		expect(ctx.close).toHaveBeenCalledTimes(1);
	});

	it('should strip --preset prefix from code', () => {
		const fixture = TestBed.createComponent(OpenPresetDialog);
		fixture.componentRef.setInput('open', 'open');
		fixture.detectChanges();
		const component = fixture.componentInstance;
		const applySpy = vitest.fn();
		fixture.componentInstance.apply.subscribe(applySpy);
		const ctx = { close: vitest.fn() };
		component['_inputValue'].set('--preset b42');
		component['_apply'](ctx);
		expect(applySpy).toHaveBeenCalledWith('b42');
	});
});
