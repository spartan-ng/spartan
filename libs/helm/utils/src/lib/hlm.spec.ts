import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	Directive,
	ElementRef,
	inject,
	Injector,
	input,
	runInInjectionContext,
	signal,
	viewChild,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HlmButton } from '@spartan-ng/helm/button';
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
			classes(() => 'p-4 rounded-lg', { elementRef });
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
			classes(() => 'bg-red-500 m-4', { elementRef });
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
							return state === 'white' ? 'text-white p-2' : 'text-black p-4';
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

	it('should work correctly with hlm-button variant changes', async () => {
		@Component({
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: `
				<button #buttonElement hlmBtn [variant]="variant()" (click)="toggleVariant()" data-testid="test-button">
					Test Button
				</button>
			`,
		})
		class TestComponent {
			public readonly buttonElement = viewChild.required('buttonElement', { read: ElementRef });
			public readonly variant = signal<'default' | 'ghost'>('default');

			toggleVariant() {
				this.variant.set(this.variant() === 'default' ? 'ghost' : 'default');
			}
		}

		const { getByTestId } = await render(TestComponent, {
			componentImports: [HlmButton],
		});

		const button = getByTestId('test-button') as HTMLButtonElement;
		const user = userEvent.setup();

		// Initial state should have default variant classes
		expect(button.className).toContain('bg-primary');
		expect(button.className).toContain('text-primary-foreground');
		expect(button.className).toContain('hover:bg-primary/90');
		expect(button.className).not.toContain('hover:bg-accent');
		expect(button.className).not.toContain('hover:text-accent-foreground');

		// Click to change to ghost variant
		await user.click(button);

		// Should now have ghost variant classes
		expect(button.className).toContain('hover:bg-accent');
		expect(button.className).toContain('hover:text-accent-foreground');
		expect(button.className).not.toContain('bg-primary');
		expect(button.className).not.toContain('text-primary-foreground');
		expect(button.className).not.toContain('hover:bg-primary/90');

		// Common classes should still be present
		expect(button.className).toContain('inline-flex');
		expect(button.className).toContain('items-center');
		expect(button.className).toContain('justify-center');
		expect(button.className).toContain('rounded-md');
		expect(button.className).toContain('text-sm');
		expect(button.className).toContain('font-medium');

		// Click again to change back to default
		await user.click(button);

		// Should be back to default variant classes
		expect(button.className).toContain('bg-primary');
		expect(button.className).toContain('text-primary-foreground');
		expect(button.className).toContain('hover:bg-primary/90');
		expect(button.className).not.toContain('hover:bg-accent');
		expect(button.className).not.toContain('hover:text-accent-foreground');
	});

	it('should handle SSR scenario with pre-rendered classes correctly', async () => {
		await TestBed.configureTestingModule({}).compileComponents();

		// Simulate SSR scenario: element already has classes from server rendering
		const element = document.createElement('div');
		element.className = 'bg-blue-500 text-white some-external-class';

		const elementRef = new ElementRef(element);

		TestBed.runInInjectionContext(() => {
			// Component hydrates and applies classes that should replace the SSR classes
			classes(() => 'bg-red-500 text-black m-2', { elementRef });
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

	describe('Performance Benchmarks', () => {
		const ELEMENT_COUNT = 1000; // Reduce for more realistic Angular rendering
		const PERFORMANCE_THRESHOLD_MS = 500; // Allow for Angular rendering overhead
		const MEMORY_THRESHOLD_MB = 50;

		function measureMemory(): number {
			if ('performance' in window && 'memory' in (window.performance as any)) {
				return (window.performance as any).memory.usedJSHeapSize / 1024 / 1024;
			}
			return 0;
		}

		// Test directive that applies dynamic classes using the classes() function
		@Directive({
			selector: '[testDynamicClasses]',
		})
		class TestDynamicClassesDirective {
			color = input.required<string>();
			size = input.required<number>();

			constructor() {
				const elementRef = inject(ElementRef<HTMLElement>);

				classes(() => [`bg-${this.color()}-500`, 'text-white', `p-${this.size()}`, 'flex', 'items-center'], {
					elementRef,
				});
			}
		}

		// Test directive for dynamic color changes using signals
		@Directive({
			selector: '[testDynamicColors]',
		})
		class TestDynamicColorsDirective {
			colorState = input.required<() => string>();
			size = input.required<number>();

			constructor() {
				const elementRef = inject(ElementRef<HTMLElement>);

				classes(() => [`bg-${this.colorState()()}-500`, 'text-white', `p-${this.size()}`, 'flex', 'items-center'], {
					elementRef,
				});
			}
		}

		function createPerformanceTest(name: string, testFn: () => void | Promise<void>) {
			it(`${name} - should handle ${ELEMENT_COUNT} elements within performance thresholds`, async () => {
				await TestBed.configureTestingModule({}).compileComponents();

				const startMemory = measureMemory();
				const startTime = performance.now();

				await testFn();

				const endTime = performance.now();
				const endMemory = measureMemory();

				const duration = endTime - startTime;
				const memoryUsed = endMemory - startMemory;

				console.log(`Performance Test "${name}":`, {
					duration: `${duration.toFixed(2)}ms`,
					memoryUsed: `${memoryUsed.toFixed(2)}MB`,
					elementsPerSecond: Math.round(ELEMENT_COUNT / (duration / 1000)),
				});

				expect(duration).toBeLessThan(PERFORMANCE_THRESHOLD_MS);
				if (startMemory > 0) {
					expect(memoryUsed).toBeLessThan(MEMORY_THRESHOLD_MB);
				}
			});
		}

		// Performance test using Angular @for with classes() function via directive
		createPerformanceTest('Angular @for with classes() function via directive', async () => {
			@Component({
				template: `
					@for (item of items; track item.id) {
						<div testDynamicClasses [color]="item.color" [size]="item.size" class="base-item" [attr.data-id]="item.id">
							Item {{ item.id }}: {{ item.name }}
						</div>
					}
				`,
				changeDetection: ChangeDetectionStrategy.OnPush,
				imports: [TestDynamicClassesDirective],
			})
			class ClassesFunctionComponent {
				items = Array.from({ length: ELEMENT_COUNT }, (_, i) => ({
					id: i,
					name: `Item ${i}`,
					color: i % 2 === 0 ? 'red' : 'blue',
					size: (i % 4) + 1,
				}));
			}

			const { fixture } = await render(ClassesFunctionComponent);
			await fixture.whenStable();

			// Verify a sample of elements
			const elements = Array.from(fixture.nativeElement.querySelectorAll('[data-id]')) as HTMLElement[];
			const sampleIndexes = [0, Math.floor(ELEMENT_COUNT / 4), Math.floor(ELEMENT_COUNT / 2), ELEMENT_COUNT - 1];

			sampleIndexes.forEach((index) => {
				const item = (fixture.componentInstance as any).items[index];
				expect(elements[index].className).toContain(`bg-${item.color}-500`);
				expect(elements[index].className).toContain('text-white');
				expect(elements[index].className).toContain('flex');
				expect(elements[index].className).toContain('base-item');
			});
		});

		// Performance test using Angular @for with static classes
		createPerformanceTest('Angular @for with static classes (baseline)', async () => {
			@Component({
				template: `
					@for (item of items; track item.id) {
						<div class="base-item flex items-center bg-red-500 p-1 text-white" [attr.data-id]="item.id">
							Item {{ item.id }}: {{ item.name }}
						</div>
					}
				`,
				changeDetection: ChangeDetectionStrategy.OnPush,
			})
			class StaticClassesComponent {
				items = Array.from({ length: ELEMENT_COUNT }, (_, i) => ({
					id: i,
					name: `Item ${i}`,
				}));
			}

			const { fixture } = await render(StaticClassesComponent);
			await fixture.whenStable();

			// Verify a sample of elements
			const elements = Array.from(fixture.nativeElement.querySelectorAll('[data-id]')) as HTMLElement[];
			const sampleIndexes = [0, Math.floor(ELEMENT_COUNT / 4), Math.floor(ELEMENT_COUNT / 2), ELEMENT_COUNT - 1];

			sampleIndexes.forEach((index) => {
				expect(elements[index].className).toContain('bg-red-500');
				expect(elements[index].className).toContain('text-white');
				expect(elements[index].className).toContain('flex');
				expect(elements[index].className).toContain('base-item');
			});
		});

		// Performance test using Angular @for with [class] binding
		createPerformanceTest('Angular @for with [class] binding', async () => {
			@Component({
				template: `
					@for (item of items; track item.id) {
						<div [class]="getClasses(item)" class="base-item" [attr.data-id]="item.id">
							Item {{ item.id }}: {{ item.name }}
						</div>
					}
				`,
				changeDetection: ChangeDetectionStrategy.OnPush,
			})
			class ClassBindingComponent {
				items = Array.from({ length: ELEMENT_COUNT }, (_, i) => ({
					id: i,
					name: `Item ${i}`,
					color: i % 2 === 0 ? 'red' : 'blue',
					size: (i % 4) + 1,
				}));

				getClasses(item: any): string {
					return `bg-${item.color}-500 text-white p-${item.size} flex items-center`;
				}
			}

			const { fixture } = await render(ClassBindingComponent);
			await fixture.whenStable();

			// Verify a sample of elements
			const elements = Array.from(fixture.nativeElement.querySelectorAll('[data-id]')) as HTMLElement[];
			const sampleIndexes = [0, Math.floor(ELEMENT_COUNT / 4), Math.floor(ELEMENT_COUNT / 2), ELEMENT_COUNT - 1];

			sampleIndexes.forEach((index) => {
				const item = (fixture.componentInstance as any).items[index];
				expect(elements[index].className).toContain(`bg-${item.color}-500`);
				expect(elements[index].className).toContain('text-white');
				expect(elements[index].className).toContain('flex');
				expect(elements[index].className).toContain('base-item');
			});
		});

		// Performance test for dynamic updates with Angular change detection via directive
		createPerformanceTest('Angular dynamic updates with classes() function via directive', async () => {
			@Component({
				template: `
					@for (item of items; track item.id) {
						<div
							testDynamicColors
							[colorState]="getColorState"
							[size]="item.size"
							class="base-item"
							[attr.data-id]="item.id"
						>
							Item {{ item.id }}: {{ item.name }}
						</div>
					}
					<button (click)="toggleColors()" data-testid="toggle">Toggle Colors</button>
				`,
				changeDetection: ChangeDetectionStrategy.OnPush,

				imports: [TestDynamicColorsDirective],
			})
			class DynamicClassesComponent {
				colorState = signal<'red' | 'blue'>('red');

				items = Array.from({ length: ELEMENT_COUNT }, (_, i) => ({
					id: i,
					name: `Item ${i}`,
					size: (i % 4) + 1,
				}));

				getColorState = () => this.colorState();

				toggleColors() {
					this.colorState.set(this.colorState() === 'red' ? 'blue' : 'red');
				}
			}

			const { fixture, getByTestId } = await render(DynamicClassesComponent);
			const user = userEvent.setup();
			await fixture.whenStable();

			// Get initial state
			const elements = Array.from(fixture.nativeElement.querySelectorAll('[data-id]')) as HTMLElement[];
			expect(elements[0].className).toContain('bg-red-500');

			// Measure update performance
			const updateStart = performance.now();
			await user.click(getByTestId('toggle'));
			await fixture.whenStable();
			const updateEnd = performance.now();

			console.log(
				`Dynamic update performance: ${(updateEnd - updateStart).toFixed(2)}ms for ${ELEMENT_COUNT} elements`,
			);

			// Verify colors changed
			expect(elements[0].className).toContain('bg-blue-500');
			expect(elements[0].className).not.toContain('bg-red-500');
		});
	});
});
