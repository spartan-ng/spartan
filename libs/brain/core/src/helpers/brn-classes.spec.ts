import { NgClass } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	createEnvironmentInjector,
	Directive,
	DoCheck,
	ElementRef,
	EnvironmentInjector,
	ErrorHandler,
	Injector,
	input,
	provideZoneChangeDetection,
	runInInjectionContext,
	signal,
	viewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { type ClassValue, cn } from 'cn';
import { createCn } from 'cn/config';
import { brnClasses, type BrnClassesOptions } from './brn-classes';

// mirrors the `classes` wrapper from @spartan-ng/helm/utils
function classes(computed: () => ClassValue[] | string, options: Omit<BrnClassesOptions, 'merge'> = {}) {
	brnClasses(computed, { ...options, merge: cn });
}

describe('brnClasses', () => {
	it('should merge with the provided merge function', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		const elementRef = new ElementRef(element);
		const merge = createCn({ extend: { classGroups: { 'font-size': [{ text: ['hero'] }] } } });

		TestBed.runInInjectionContext(() => {
			brnClasses(() => 'text-sm text-hero', { elementRef, merge });
		});

		await new Promise((resolve) => setTimeout(resolve, 0));

		// the default config would keep both, as text-hero is not a known font-size
		expect(element.className).toBe('text-hero');
	});

	it('should keep applying classes after the merge function threw', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		const elementRef = new ElementRef(element);
		const state = signal('p-2');
		let shouldThrow = true;
		const merge = (...inputs: ClassValue[]) => {
			if (shouldThrow) throw new Error('merge failed');
			return cn(...inputs);
		};

		TestBed.runInInjectionContext(() => {
			brnClasses(() => state(), { elementRef, merge });
		});

		expect(() => TestBed.tick()).toThrow('merge failed');

		shouldThrow = false;
		state.set('p-4');
		TestBed.tick();

		expect(element.className).toBe('p-4');
	});

	it('should work when called within injection context', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = 'existing-class';

		const elementRef = new ElementRef(element);
		const computedClasses = () => ['bg-red-500', 'text-white'];

		TestBed.runInInjectionContext(() => {
			classes(computedClasses, { elementRef });
		});

		// Wait for afterRenderEffect to run
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(element.className).toBe('bg-red-500 text-white existing-class');
	});

	it('should prioritize existing element classes over classes added via the utility', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = 'bg-blue-500 p-2';

		const elementRef = new ElementRef(element);
		const computedClasses = () => ['bg-red-500', 'text-white'];

		TestBed.runInInjectionContext(() => {
			classes(computedClasses, { elementRef });
		});

		// Wait for afterRenderEffect to run
		await new Promise((resolve) => setTimeout(resolve, 0));

		// The existing class (bg-blue-500) takes precedence over the utility class (bg-red-500)
		expect(element.className).toBe('text-white bg-blue-500 p-2');
	});

	it('should handle computed classes updates with change detection', async () => {
		@Component({
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<div #testElement class="static-class">Test Element</div>
				<button (click)="toggleState()" data-testid="toggle-button">Toggle</button>
			`,
		})
		class TestComponent implements AfterViewInit {
			public readonly elementRef = viewChild.required('testElement', { read: ElementRef });

			public readonly state = signal<'red' | 'blue'>('red');

			ngAfterViewInit() {
				// Use runInInjectionContext to properly set up the injection context
				const injector = TestBed.inject(Injector);
				runInInjectionContext(injector, () => {
					classes(
						() => {
							const currentState = this.state();
							return currentState === 'red' ? ['bg-red-500', 'text-white'] : ['bg-blue-500', 'text-black'];
						},
						{ elementRef: this.elementRef() },
					);
				});
			}

			toggleState() {
				this.state.set(this.state() === 'red' ? 'blue' : 'red');
			}
		}

		const { getByTestId, fixture } = await render(TestComponent);
		const toggleButton = getByTestId('toggle-button');
		const testElement = fixture.componentInstance.elementRef().nativeElement;
		const user = userEvent.setup();

		// Wait for the classes effect to flush after the initial render
		fixture.detectChanges();
		await new Promise((resolve) => setTimeout(resolve, 0));

		// Initial state should have red classes
		expect(testElement.className).toBe('bg-red-500 text-white static-class');

		// Click to toggle state
		await user.click(toggleButton);

		// Should now have blue classes after change detection
		expect(testElement.className).toBe('bg-blue-500 text-black static-class');

		// Click again to toggle back
		await user.click(toggleButton);

		// Should be back to red classes
		expect(testElement.className).toBe('bg-red-500 text-white static-class');
	});

	it('should handle empty computed classes', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = 'existing-class';

		const elementRef = new ElementRef(element);
		const computedClasses = () => [];

		TestBed.runInInjectionContext(() => {
			classes(computedClasses, { elementRef });
		});

		// Wait for afterRenderEffect to run
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(element.className).toBe('existing-class');
	});

	it('should handle complex class types', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = '';

		const elementRef = new ElementRef(element);
		const computedClasses = () => [
			'bg-red-500',
			{ 'text-white': true, hidden: false },
			['p-4', 'm-2'],
			null,
			undefined,
			'',
		];

		TestBed.runInInjectionContext(() => {
			classes(computedClasses, { elementRef });
		});

		// Wait for afterRenderEffect to run
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(element.className).toBe('bg-red-500 text-white p-4 m-2');
	});

	it('should handle special character classes', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = '';

		const elementRef = new ElementRef(element);
		const computedClasses = () => ['bg-red-500/50', '[&>*]:text-white', 'hover:bg-blue-500'];

		TestBed.runInInjectionContext(() => {
			classes(computedClasses, { elementRef });
		});

		// Wait for afterRenderEffect to run
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(element.className).toBe('bg-red-500/50 [&>*]:text-white hover:bg-blue-500');
	});

	it('should merge classes from multiple sources on the same element', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = 'base-class';

		const elementRef = new ElementRef(element);

		TestBed.runInInjectionContext(() => {
			// First source adds some classes
			classes(() => 'bg-blue-500 text-white', { elementRef });

			// Second source adds different classes
			classes(() => 'rounded-lg p-4', { elementRef });
		});

		// Wait for afterRenderEffect to run
		await new Promise((resolve) => setTimeout(resolve, 0));

		const classNames = element.className.split(' ').filter((c) => c.length > 0);
		expect(classNames).toContain('base-class');
		expect(classNames).toContain('bg-blue-500');
		expect(classNames).toContain('text-white');
		expect(classNames).toContain('p-4');
		expect(classNames).toContain('rounded-lg');
	});

	it('should handle conflicting classes from multiple sources with tailwind merge', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = '';

		const elementRef = new ElementRef(element);

		TestBed.runInInjectionContext(() => {
			// Both sources provide conflicting background colors
			classes(() => 'bg-blue-500 p-2', { elementRef });
			classes(() => 'm-4 bg-red-500', { elementRef });
		});

		await new Promise((resolve) => setTimeout(resolve, 0));

		// Should only have one background color due to the merge function
		// Later registered classes should take precedence
		const classNames = element.className.split(' ').filter((c) => c.length > 0);
		expect(classNames).toContain('bg-red-500'); // Later registration wins
		expect(classNames).not.toContain('bg-blue-500');
		expect(classNames).toContain('p-2');
		expect(classNames).toContain('m-4');
	});

	it('should ensure later registered classes take precedence', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = '';

		const elementRef = new ElementRef(element);

		TestBed.runInInjectionContext(() => {
			// First source
			classes(() => 'bg-blue-500 text-black', { elementRef });

			// Second source - should take precedence
			classes(() => 'bg-red-500 text-white', { elementRef });
		});

		await new Promise((resolve) => setTimeout(resolve, 0));

		const classNames = element.className.split(' ').filter((c) => c.length > 0);

		// Later classes should win conflicts
		expect(classNames).toContain('bg-red-500');
		expect(classNames).toContain('text-white');
		expect(classNames).not.toContain('bg-blue-500');
		expect(classNames).not.toContain('text-black');
	});

	it('should maintain precedence order when classes update dynamically', async () => {
		@Component({
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<div #testElement>Test Element</div>
			`,
		})
		class TestComponent implements AfterViewInit {
			public readonly elementRef = viewChild.required('testElement', { read: ElementRef });
			public readonly firstState = signal<'red' | 'blue'>('red');
			public readonly secondState = signal<'white' | 'black'>('white');

			ngAfterViewInit() {
				const injector = TestBed.inject(Injector);
				runInInjectionContext(injector, () => {
					// First source (lower precedence)
					classes(
						() => {
							const state = this.firstState();
							return state === 'red' ? 'bg-red-500 text-gray-500' : 'bg-blue-500 text-gray-600';
						},
						{ elementRef: this.elementRef() },
					);

					// Second source (higher precedence) - should always win conflicts
					classes(
						() => {
							const state = this.secondState();
							return state === 'white' ? 'p-2 text-white' : 'p-4 text-black';
						},
						{ elementRef: this.elementRef() },
					);
				});
			}
		}

		const { fixture } = await render(TestComponent);
		const testElement = fixture.componentInstance.elementRef().nativeElement;

		// Wait for the classes effect to flush after the initial render
		fixture.detectChanges();
		await new Promise((resolve) => setTimeout(resolve, 0));

		// Initial state: first=red, second=white
		// Expected: bg-red-500 from first, text-white from second (wins over text-gray-500), p-2 from second
		expect(testElement.className).toContain('bg-red-500');
		expect(testElement.className).toContain('text-white'); // Second source wins
		expect(testElement.className).toContain('p-2');
		expect(testElement.className).not.toContain('text-gray-500'); // First source loses

		// Change first source state
		fixture.componentInstance.firstState.set('blue');
		fixture.detectChanges();
		await new Promise((resolve) => setTimeout(resolve, 0));

		// Should now have: bg-blue-500 from first, text-white from second (still wins), p-2 from second
		expect(testElement.className).toContain('bg-blue-500');
		expect(testElement.className).toContain('text-white'); // Second source still wins
		expect(testElement.className).toContain('p-2');
		expect(testElement.className).not.toContain('bg-red-500');
		expect(testElement.className).not.toContain('text-gray-600');

		// Change second source state
		fixture.componentInstance.secondState.set('black');
		fixture.detectChanges();
		await new Promise((resolve) => setTimeout(resolve, 0));

		// Should now have: bg-blue-500 from first, text-black from second (still wins), p-4 from second
		expect(testElement.className).toContain('bg-blue-500');
		expect(testElement.className).toContain('text-black'); // Second source still wins
		expect(testElement.className).toContain('p-4');
		expect(testElement.className).not.toContain('text-white');
		expect(testElement.className).not.toContain('p-2');
		expect(testElement.className).not.toContain('text-gray-600'); // First source still loses
	});

	it('should handle SSR scenario by preserving pre-rendered classes', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		// Simulate SSR scenario: element already has classes from server rendering
		const element = document.createElement('div');
		element.className = 'bg-blue-500 text-white some-external-class';

		const elementRef = new ElementRef(element);

		TestBed.runInInjectionContext(() => {
			// Component hydrates; added classes should merge, but existing SSR classes take precedence on conflict
			classes(() => 'm-2 bg-red-500 text-black', { elementRef });
		});

		await new Promise((resolve) => setTimeout(resolve, 0));

		const classNames = element.className.split(' ').filter((c) => c.length > 0);

		// Should contain the non-conflicting new class
		expect(classNames).toContain('m-2');

		// Should preserve the existing SSR classes
		expect(classNames).toContain('bg-blue-500');
		expect(classNames).toContain('text-white');

		// Should not contain the conflicting hydration classes because existing classes win
		expect(classNames).not.toContain('bg-red-500');
		expect(classNames).not.toContain('text-black');

		// Should preserve truly external classes that don't conflict
		expect(classNames).toContain('some-external-class');
	});

	it('should suppress transitions during initial class application', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = 'bg-blue-500';

		const elementRef = new ElementRef(element);
		const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
		let restoreTransition: FrameRequestCallback | undefined;

		rafSpy.mockImplementation((callback: FrameRequestCallback) => {
			restoreTransition = callback;
			return 1;
		});

		try {
			TestBed.runInInjectionContext(() => {
				classes(() => 'bg-red-500 text-white', { elementRef });
			});

			// After registration but before effect, transition should be suppressed
			expect(element.style.getPropertyValue('transition')).toBe('none');
			expect(element.style.getPropertyPriority('transition')).toBe('important');

			// Wait for effect to run
			await new Promise((resolve) => setTimeout(resolve, 0));

			// After effect but before rAF, transition should still be suppressed
			expect(element.style.getPropertyValue('transition')).toBe('none');

			// Wait for requestAnimationFrame to fire
			expect(restoreTransition).toBeDefined();
			restoreTransition?.(performance.now());

			// After rAF, transition suppression should be removed
			expect(element.style.getPropertyValue('transition')).toBe('');
		} finally {
			rafSpy.mockRestore();
		}
	});

	it('should restore pre-existing inline transition after suppression', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = 'bg-blue-500';
		element.style.setProperty('transition', 'opacity 0.3s ease', 'important');

		const elementRef = new ElementRef(element);

		TestBed.runInInjectionContext(() => {
			classes(() => 'bg-red-500 text-white', { elementRef });
		});

		// Should be overridden during suppression
		expect(element.style.getPropertyValue('transition')).toBe('none');

		// Wait for effect + rAF
		await new Promise((resolve) => setTimeout(resolve, 0));
		await new Promise((resolve) => requestAnimationFrame(resolve));

		// Should restore the original transition value. A real browser normalizes the shorthand on
		// assignment - the default `ease` timing function is dropped from the serialized value.
		expect(element.style.getPropertyValue('transition')).toBe('opacity 0.3s');
		expect(element.style.getPropertyPriority('transition')).toBe('important');
	});

	it('should suppress transitions even on elements without existing classes', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');

		const elementRef = new ElementRef(element);

		TestBed.runInInjectionContext(() => {
			classes(() => 'bg-red-500 text-white', { elementRef });
		});

		// Should still suppress — we always suppress in browser to be safe
		expect(element.style.getPropertyValue('transition')).toBe('none');

		// Wait for effect + rAF to clean up
		await new Promise((resolve) => setTimeout(resolve, 0));
		await new Promise((resolve) => requestAnimationFrame(resolve));

		expect(element.style.getPropertyValue('transition')).toBe('');
	});

	it('should restore transition immediately when destroyed before first effect runs', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = 'bg-blue-500';
		element.style.setProperty('transition', 'opacity 0.3s ease', 'important');

		const elementRef = new ElementRef(element);
		const parentInjector = TestBed.inject(EnvironmentInjector);
		const childInjector = createEnvironmentInjector([], parentInjector);

		classes(() => 'bg-red-500 text-white', { elementRef, injector: childInjector });

		// Suppression should be active immediately after registration
		expect(element.style.getPropertyValue('transition')).toBe('none');
		expect(element.style.getPropertyPriority('transition')).toBe('important');

		// Destroy before the first effect flushes
		childInjector.destroy();

		// Original transition should be restored immediately by cleanup. A real browser normalizes the
		// shorthand on assignment - the default `ease` timing function is dropped from the value.
		expect(element.style.getPropertyValue('transition')).toBe('opacity 0.3s');
		expect(element.style.getPropertyPriority('transition')).toBe('important');
	});

	it('should preserve external classes added by mutation observer', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		// Element has initial classes
		const element = document.createElement('div');
		element.className = 'custom-utility data-testid';

		const elementRef = new ElementRef(element);

		TestBed.runInInjectionContext(() => {
			// Apply source classes
			classes(() => 'bg-red-500 text-black', { elementRef });
		});

		await new Promise((resolve) => setTimeout(resolve, 0));

		// Simulate external class addition (like from another directive or JS library)
		element.classList.add('external-added-class');

		// Wait for mutation observer to process
		await new Promise((resolve) => setTimeout(resolve, 0));

		const classNames = element.className.split(' ').filter((c) => c.length > 0);

		// Should have classes from sources
		expect(classNames).toContain('bg-red-500');
		expect(classNames).toContain('text-black');

		// Should preserve all external classes
		expect(classNames).toContain('custom-utility');
		expect(classNames).toContain('data-testid');
		expect(classNames).toContain('external-added-class');
	});

	// https://github.com/spartan-ng/spartan/issues/1823
	it('should not trigger zone change detection loops when class attributes are rewritten', async () => {
		@Directive({ selector: '[brnTestClasses]' })
		class TestClassesDirective {
			constructor() {
				classes(() => 'inline-flex');
			}
		}

		let checks = 0;

		@Component({
			imports: [NgClass, TestClassesDirective],
			// the loop only happens when the host is checked on every pass
			// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
			changeDetection: ChangeDetectionStrategy.Eager,
			// NgClass calls removeClass on every check, which mutates the class attribute
			template: `
				<span brnTestClasses>badge</span>
				<div class="foo" [ngClass]="{ foo: false }"></div>
			`,
		})
		class TestComponent implements DoCheck {
			ngDoCheck() {
				// a loop would never yield, so bail out to keep the test from hanging
				if (++checks > 50) throw new Error('change detection loop');
			}
		}

		TestBed.configureTestingModule({ providers: [provideZoneChangeDetection()] });
		const fixture = TestBed.createComponent(TestComponent);
		fixture.autoDetectChanges();
		await fixture.whenStable();
		await new Promise((resolve) => setTimeout(resolve, 50));

		expect(checks).toBeLessThan(10);
	});

	it('should not run an extra zone change detection pass for a batched merge', async () => {
		@Directive({ selector: '[brnTestClasses]' })
		class TestClassesDirective {
			constructor() {
				classes(() => 'inline-flex');
			}
		}

		let checks = 0;

		@Component({
			imports: [TestClassesDirective],
			// counts every pass the zone triggers
			// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
			changeDetection: ChangeDetectionStrategy.Eager,
			template: `
				<button brnTestClasses [class.on]="on" (click)="on = !on">toggle</button>
			`,
		})
		class TestComponent implements DoCheck {
			public on = false;

			ngDoCheck() {
				checks++;
			}
		}

		TestBed.configureTestingModule({ providers: [provideZoneChangeDetection()] });
		const fixture = TestBed.createComponent(TestComponent);
		fixture.autoDetectChanges();
		await fixture.whenStable();
		await new Promise((resolve) => setTimeout(resolve, 0));

		checks = 0;
		fixture.nativeElement.querySelector('button').click();
		await fixture.whenStable();
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(fixture.nativeElement.querySelector('button').className).toBe('inline-flex on');
		expect(checks).toBe(1);
	});

	it('should merge once when several class bindings change in the same pass', async () => {
		let merges = 0;
		const merge = (...inputs: ClassValue[]) => (merges++, cn(...inputs));

		@Directive({ selector: '[brnTestClasses]' })
		class TestClassesDirective {
			constructor() {
				brnClasses(() => 'inline-flex', { merge });
			}
		}

		@Component({
			imports: [TestClassesDirective],
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<span brnTestClasses [class.p-2]="on()" [class.m-2]="on()" [class.gap-2]="on()"></span>
			`,
		})
		class TestComponent {
			public readonly on = signal(false);
		}

		const fixture = TestBed.createComponent(TestComponent);
		fixture.autoDetectChanges();
		await fixture.whenStable();

		merges = 0;
		fixture.componentInstance.on.set(true);
		await fixture.whenStable();
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(fixture.nativeElement.querySelector('span').className).toBe('inline-flex p-2 m-2 gap-2');
		expect(merges).toBe(1);
	});

	it('should drop a source class once the source stops emitting it, even after classList.toggle', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		const elementRef = new ElementRef(element);
		const line = signal('border-solid');

		TestBed.runInInjectionContext(() => {
			classes(() => line(), { elementRef });
		});
		TestBed.tick();

		// a third-party toggle of a class it sees on the element removes it natively
		expect(element.classList.toggle('border-solid')).toBe(false);

		line.set('border-dotted');
		TestBed.tick();

		expect(element.className).toBe('border-dotted');
	});

	it('should report a merge error from a class binding without breaking the host template', async () => {
		const handleError = vi.fn();
		const merge = (...inputs: ClassValue[]) => {
			const merged = cn(...inputs);
			if (merged.includes('boom')) throw new Error('merge failed');
			return merged;
		};

		@Directive({ selector: '[brnTestClasses]' })
		class TestClassesDirective {
			constructor() {
				brnClasses(() => 'inline-flex', { merge });
			}
		}

		@Component({
			imports: [TestClassesDirective],
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<span brnTestClasses [class.boom]="on()"></span>
				<p>{{ on() ? 'on' : 'off' }}</p>
			`,
		})
		class TestComponent {
			public readonly on = signal(false);
		}

		TestBed.configureTestingModule({
			rethrowApplicationErrors: false,
			providers: [{ provide: ErrorHandler, useValue: { handleError } }],
		});
		const fixture = TestBed.createComponent(TestComponent);
		fixture.autoDetectChanges();
		await fixture.whenStable();

		fixture.componentInstance.on.set(true);
		await fixture.whenStable();
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(fixture.nativeElement.querySelector('p').textContent).toBe('on');
		expect(handleError).toHaveBeenCalledWith(expect.objectContaining({ message: 'merge failed' }));
	});

	it('should replace a source class through classList.replace like the native method', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		const elementRef = new ElementRef(element);

		TestBed.runInInjectionContext(() => {
			classes(() => 'border-solid', { elementRef });
		});
		TestBed.tick();

		expect(element.classList.replace('border-solid', 'border-dashed')).toBe(true);
	});

	it('should report a merge error from an external className write', async () => {
		const handleError = vi.fn();
		TestBed.configureTestingModule({
			rethrowApplicationErrors: false,
			providers: [{ provide: ErrorHandler, useValue: { handleError } }],
		});

		const element = document.createElement('div');
		document.body.appendChild(element);
		const merge = (...inputs: ClassValue[]) => {
			const merged = cn(...inputs);
			if (merged.includes('boom')) throw new Error('merge failed');
			return merged;
		};

		TestBed.runInInjectionContext(() => {
			brnClasses(() => 'inline-flex', { elementRef: new ElementRef(element), merge });
		});
		TestBed.tick();

		element.className = 'boom';
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(handleError).toHaveBeenCalledWith(expect.objectContaining({ message: 'merge failed' }));
		element.remove();
	});

	describe('tracked classList', () => {
		const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
		const sorted = (element: HTMLElement) => element.className.split(' ').filter(Boolean).sort();
		let element: HTMLElement;

		beforeEach(async () => {
			await TestBed.configureTestingModule({}).compileComponents();
			element = document.createElement('div');
			document.body.appendChild(element);
		});

		afterEach(() => element.remove());

		function track(initial = '') {
			element.className = initial;
			TestBed.runInInjectionContext(() => {
				classes(() => 'inline-flex', { elementRef: new ElementRef(element) });
			});
			TestBed.tick();
		}

		it('should toggle a class back on when toggled twice in the same tick', async () => {
			track('active');

			expect(element.classList.toggle('active')).toBe(false);
			expect(element.classList.toggle('active')).toBe(true);
			await settle();

			expect(sorted(element)).toEqual(['active', 'inline-flex']);
		});

		it('should keep a classList write made right after a className write', async () => {
			track();

			element.className = 'm-2';
			element.classList.add('p-4');
			await settle();

			expect(sorted(element)).toEqual(['inline-flex', 'm-2', 'p-4']);
		});

		it('should forget merged-out classes when className is rewritten in a different order', async () => {
			track();
			element.classList.add('p-2');
			element.classList.add('p-4');
			await settle();
			expect(sorted(element)).toEqual(['inline-flex', 'p-4']);

			element.className = 'p-4 inline-flex';
			await settle();
			element.classList.remove('p-4');
			await settle();

			expect(sorted(element)).toEqual(['inline-flex']);
		});

		it('should not replace a class the merge dropped from the element', async () => {
			track();
			element.classList.add('bg-red-500');
			element.classList.add('bg-blue-500');
			await settle();

			expect(element.classList.replace('bg-red-500', 'm-2')).toBe(false);
			element.classList.remove('bg-blue-500');
			await settle();

			expect(sorted(element)).toEqual(['bg-red-500', 'inline-flex']);
		});

		it('should toggle on a class the merge dropped from the element', async () => {
			track();
			element.classList.add('bg-red-500');
			element.classList.add('bg-blue-500');
			await settle();

			expect(element.classList.toggle('bg-red-500')).toBe(true);
			await settle();

			expect(sorted(element)).toEqual(['bg-red-500', 'inline-flex']);
		});

		it('should not track a token the native classList rejects', async () => {
			track();

			expect(() => element.classList.add('p-2 p-4')).toThrow();
			element.classList.add('m-2');
			await settle();

			expect(sorted(element)).toEqual(['inline-flex', 'm-2']);
		});

		it('should merge a className write even when the next classList write is rejected', async () => {
			track();

			element.className = 'm-2';
			expect(() => element.classList.add('p-2 p-4')).toThrow();
			await settle();

			expect(sorted(element)).toEqual(['inline-flex', 'm-2']);
		});

		it('should keep the old class when replace rejects the new token', async () => {
			track('active');

			expect(() => element.classList.replace('active', 'p-2 p-4')).toThrow();
			await settle();

			expect(sorted(element)).toEqual(['active', 'inline-flex']);
		});

		it('should replace a tracked class', async () => {
			track('active');

			expect(element.classList.replace('active', 'idle')).toBe(true);
			expect(element.classList.replace('missing', 'other')).toBe(false);
			await settle();

			expect(sorted(element)).toEqual(['idle', 'inline-flex']);
		});
	});

	it('should keep a static class that a source also produces once the source changes', async () => {
		@Directive({ selector: '[brnDisplay]' })
		class Display {
			public readonly block = input(false);

			constructor() {
				classes(() => (this.block() ? 'block' : 'inline-flex'));
			}
		}

		@Component({
			imports: [Display],
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<span brnDisplay [block]="block()" class="inline-flex"></span>
			`,
		})
		class Host {
			public readonly block = signal(false);
		}

		const fixture = TestBed.createComponent(Host);
		fixture.autoDetectChanges();
		await fixture.whenStable();
		fixture.componentInstance.block.set(true);
		await fixture.whenStable();

		expect(fixture.nativeElement.querySelector('span').className).toBe('inline-flex');
	});
});
