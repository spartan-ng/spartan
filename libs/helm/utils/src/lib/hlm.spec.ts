import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	createEnvironmentInjector,
	ElementRef,
	EnvironmentInjector,
	Injector,
	runInInjectionContext,
	signal,
	viewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { classes } from './hlm';

describe('classes', () => {
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

	it('should handle class merging and deduplication', async () => {
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

		// twMerge should resolve bg conflict, keeping the last one (bg-red-500)
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

		// Should only have one background color due to tailwind-merge
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

	it('should handle SSR scenario with pre-rendered classes correctly', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		// Simulate SSR scenario: element already has classes from server rendering
		const element = document.createElement('div');
		element.className = 'bg-blue-500 text-white some-external-class';

		const elementRef = new ElementRef(element);

		TestBed.runInInjectionContext(() => {
			// Component hydrates and applies classes that should replace the SSR classes
			classes(() => 'm-2 bg-red-500 text-black', { elementRef });
		});

		await new Promise((resolve) => setTimeout(resolve, 0));

		const classNames = element.className.split(' ').filter((c) => c.length > 0);

		// Should have new classes from the source, not old SSR classes
		expect(classNames).toContain('bg-blue-500');
		expect(classNames).toContain('text-white');
		expect(classNames).toContain('m-2');

		// Should not have conflicting SSR classes (twMerge should handle these)
		expect(classNames).not.toContain('bg-red-500'); // Blue takes precedence
		expect(classNames).not.toContain('text-black'); // Replaced by text-white

		// Should preserve truly external classes that don't conflict
		expect(classNames).toContain('some-external-class');
	});

	it('should suppress transitions during initial class application', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		const element = document.createElement('div');
		element.className = 'bg-blue-500';

		const elementRef = new ElementRef(element);

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
		await new Promise((resolve) => requestAnimationFrame(resolve));

		// After rAF, transition suppression should be removed
		expect(element.style.getPropertyValue('transition')).toBe('');
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

		// Should restore the original transition value
		expect(element.style.getPropertyValue('transition')).toBe('opacity 0.3s ease');
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

		// Original transition should be restored immediately by cleanup
		expect(element.style.getPropertyValue('transition')).toBe('opacity 0.3s ease');
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
});
