import { Project } from 'ts-morph';
import { describe, expect, it } from 'vitest';
import { extractInputsOutputs } from './executor';

type Member = { name: string; type?: string; description?: string; defaultValue?: string | null; required?: boolean };
type ComponentInfo = {
	file: string;
	inputs: Member[];
	outputs: Member[];
	models: Member[];
	selector: string | null;
	exportAs: string | null;
};

/**
 * Runs the extractor against a set of in-memory source files and returns a flat
 * map keyed by class name for convenient assertions.
 */
function extract(files: Record<string, string>): Record<string, ComponentInfo> {
	const project = new Project({ useInMemoryFileSystem: true });
	for (const [filePath, content] of Object.entries(files)) {
		project.createSourceFile(filePath, content);
	}

	const nested = extractInputsOutputs(project, '/') as Record<string, Record<string, Record<string, ComponentInfo>>>;

	const flat: Record<string, ComponentInfo> = {};
	for (const componentType of Object.values(nested)) {
		for (const libraryType of Object.values(componentType)) {
			for (const [className, info] of Object.entries(libraryType)) {
				flat[className] = info;
			}
		}
	}
	return flat;
}

const names = (members: Member[]) => members.map((m) => m.name);

describe('extractInputsOutputs', () => {
	describe('signal-based members', () => {
		it('extracts inputs, outputs and models with their types and defaults', () => {
			const result = extract({
				'libs/brain/foo/src/lib/brn-foo.ts': `
					import { Directive, input, output, model } from '@angular/core';
					@Directive({ selector: '[brnFoo]', exportAs: 'brnFoo' })
					export class BrnFoo {
						public readonly size = input<number>(42);
						public readonly changed = output<string>();
						public readonly value = model<boolean>(false);
					}
				`,
			});

			const foo = result['BrnFoo'];
			expect(foo.selector).toBe('[brnFoo]');
			expect(foo.exportAs).toBe('brnFoo');
			expect(foo.inputs).toEqual([
				{ name: 'size', type: 'number', description: '', defaultValue: '42', required: false },
			]);
			expect(foo.outputs).toEqual([{ name: 'changed', type: 'string', description: '' }]);
			expect(foo.models).toEqual([
				{ name: 'value', type: 'boolean', description: '', defaultValue: 'false', required: false },
			]);
		});

		it('respects aliases for input, output and model options', () => {
			const result = extract({
				'libs/brain/foo/src/lib/brn-foo.ts': `
					import { Directive, input, output, model } from '@angular/core';
					@Directive({ selector: '[brnFoo]' })
					export class BrnFoo {
						public readonly labelInput = input<string>('x', { alias: 'label' });
						public readonly openedChange = output<void>({ alias: 'opened' });
						public readonly checkedModel = model<boolean>(false, { alias: 'checked' });
					}
				`,
			});

			const foo = result['BrnFoo'];
			expect(names(foo.inputs)).toEqual(['label']);
			expect(names(foo.outputs)).toEqual(['opened']);
			expect(names(foo.models)).toEqual(['checked']);
		});

		it('handles input.required including its alias and marks it required', () => {
			const result = extract({
				'libs/brain/foo/src/lib/brn-foo.ts': `
					import { Directive, input } from '@angular/core';
					@Directive({ selector: '[brnFoo]' })
					export class BrnFoo {
						public readonly contentFor = input.required<string>({ alias: 'brnFoo' });
					}
				`,
			});

			expect(result['BrnFoo'].inputs).toEqual([
				{ name: 'brnFoo', type: 'string', description: '', defaultValue: null, required: true },
			]);
		});

		it('handles model.required as a distinct required model with no default', () => {
			const result = extract({
				'libs/helm/pagination/src/lib/hlm-pagination.ts': `
					import { Directive, model } from '@angular/core';
					@Directive({ selector: '[hlmPagination]' })
					export class HlmPagination {
						public readonly currentPage = model.required<number>();
						public readonly pageSize = model.required<number>({ alias: 'size' });
					}
				`,
			});

			expect(result['HlmPagination'].models).toEqual([
				{ name: 'currentPage', type: 'number', description: '', defaultValue: null, required: true },
				{ name: 'size', type: 'number', description: '', defaultValue: null, required: true },
			]);
		});
	});

	describe('decorator-based members', () => {
		it('respects the string alias of @Input / @Output', () => {
			const result = extract({
				'libs/brain/foo/src/lib/brn-foo.ts': `
					import { Directive, Input, Output, EventEmitter } from '@angular/core';
					@Directive({ selector: '[brnFoo]' })
					export class BrnFoo {
						@Input('publicName') internalName: string;
						@Output('opened') openedEmitter = new EventEmitter<void>();
					}
				`,
			});

			expect(names(result['BrnFoo'].inputs)).toEqual(['publicName']);
			expect(names(result['BrnFoo'].outputs)).toEqual(['opened']);
			// The decorator argument is an alias, not a default value.
			expect(result['BrnFoo'].inputs[0].defaultValue).toBeNull();
		});

		it('respects the object-form alias of @Input', () => {
			const result = extract({
				'libs/brain/foo/src/lib/brn-foo.ts': `
					import { Directive, Input } from '@angular/core';
					@Directive({ selector: '[brnFoo]' })
					export class BrnFoo {
						@Input({ alias: 'publicName' }) internalName: string;
					}
				`,
			});

			expect(names(result['BrnFoo'].inputs)).toEqual(['publicName']);
		});

		it('falls back to the property name when no alias is given', () => {
			const result = extract({
				'libs/brain/foo/src/lib/brn-foo.ts': `
					import { Directive, Input } from '@angular/core';
					@Directive({ selector: '[brnFoo]' })
					export class BrnFoo {
						@Input() plain: string;
					}
				`,
			});

			expect(names(result['BrnFoo'].inputs)).toEqual(['plain']);
		});
	});

	describe('inheritance', () => {
		it('collects inputs, outputs and models across a multi-level extends chain', () => {
			const result = extract({
				'libs/brain/foo/src/lib/base.ts': `
					import { Directive, input, output, model } from '@angular/core';
					@Directive()
					export class BaseA {
						public readonly fromA = input<string>('a');
						public readonly outA = output<void>();
						public readonly modelA = model<number>(1);
					}
					@Directive()
					export class BaseB extends BaseA {
						public readonly fromB = input<string>('b');
					}
				`,
				'libs/brain/foo/src/lib/brn-foo.ts': `
					import { Directive, input } from '@angular/core';
					import { BaseB } from './base';
					@Directive({ selector: '[brnFoo]' })
					export class BrnFoo extends BaseB {
						public readonly fromFoo = input<string>('foo');
					}
				`,
			});

			const foo = result['BrnFoo'];
			expect(names(foo.inputs)).toEqual(['fromFoo', 'fromB', 'fromA']);
			expect(names(foo.outputs)).toEqual(['outA']);
			expect(names(foo.models)).toEqual(['modelA']);
		});

		it('resolves base classes imported via a path alias (no tsconfig)', () => {
			const result = extract({
				'libs/brain/dialog/src/lib/brn-dialog.ts': `
					import { Directive, input } from '@angular/core';
					@Directive({ selector: '[brnDialog]' })
					export class BrnDialog {
						public readonly role = input<string>('dialog');
					}
				`,
				'libs/brain/drawer/src/lib/brn-drawer.ts': `
					import { Directive, input } from '@angular/core';
					import { BrnDialog } from '@spartan-ng/brain/dialog';
					@Directive({ selector: '[brnDrawer]' })
					export class BrnDrawer extends BrnDialog {
						public readonly direction = input<string>('bottom');
					}
				`,
			});

			expect(names(result['BrnDrawer'].inputs)).toEqual(['direction', 'role']);
		});

		it('lets a child override win over an inherited member with the same public name', () => {
			const result = extract({
				'libs/brain/foo/src/lib/brn-foo.ts': `
					import { Directive, input } from '@angular/core';
					@Directive()
					export class Base {
						public readonly value = input<number>(1, { alias: 'shared' });
					}
					@Directive({ selector: '[brnFoo]' })
					export class BrnFoo extends Base {
						public readonly ownValue = input<string>('x', { alias: 'shared' });
					}
				`,
			});

			const shared = result['BrnFoo'].inputs.filter((i) => i.name === 'shared');
			expect(shared).toHaveLength(1);
			expect(shared[0].type).toBe('string');
		});
	});

	describe('host directives', () => {
		it('exposes inputs and outputs applying the declared renaming', () => {
			const result = extract({
				'libs/brain/tabs/src/lib/brn-tabs-content.ts': `
					import { Directive, input, output } from '@angular/core';
					@Directive({ selector: '[brnTabsContent]' })
					export class BrnTabsContent {
						public readonly contentFor = input.required<string>({ alias: 'brnTabsContent' });
						public readonly activated = output<void>({ alias: 'brnActivated' });
					}
				`,
				'libs/helm/tabs/src/lib/hlm-tabs-content.ts': `
					import { Directive } from '@angular/core';
					import { BrnTabsContent } from '@spartan-ng/brain/tabs';
					@Directive({
						selector: '[hlmTabsContent]',
						hostDirectives: [
							{
								directive: BrnTabsContent,
								inputs: ['brnTabsContent: hlmTabsContent'],
								outputs: ['brnActivated: hlmActivated'],
							},
						],
					})
					export class HlmTabsContent {}
				`,
			});

			expect(names(result['HlmTabsContent'].inputs)).toEqual(['hlmTabsContent']);
			expect(names(result['HlmTabsContent'].outputs)).toEqual(['hlmActivated']);
		});

		it('exposes inputs without a rename', () => {
			const result = extract({
				'libs/brain/button/src/lib/brn-button.ts': `
					import { Directive, input } from '@angular/core';
					@Directive({ selector: '[brnBtn]' })
					export class BrnButton {
						public readonly variant = input<string>('default');
						public readonly size = input<string>('md');
					}
				`,
				'libs/helm/button/src/lib/hlm-button.ts': `
					import { Directive } from '@angular/core';
					import { BrnButton } from '@spartan-ng/brain/button';
					@Directive({
						selector: '[hlmBtn]',
						hostDirectives: [{ directive: BrnButton, inputs: ['variant', 'size'] }],
					})
					export class HlmButton {}
				`,
			});

			expect(names(result['HlmButton'].inputs)).toEqual(['variant', 'size']);
		});

		it('merges own members with host-directive members', () => {
			const result = extract({
				'libs/brain/button/src/lib/brn-button.ts': `
					import { Directive, input } from '@angular/core';
					@Directive({ selector: '[brnBtn]' })
					export class BrnButton {
						public readonly variant = input<string>('default');
					}
				`,
				'libs/helm/sidebar/src/lib/hlm-sidebar-trigger.ts': `
					import { Directive, input } from '@angular/core';
					import { BrnButton } from '@spartan-ng/brain/button';
					@Directive({
						selector: '[hlmSidebarTrigger]',
						hostDirectives: [{ directive: BrnButton, inputs: ['variant'] }],
					})
					export class HlmSidebarTrigger {
						public readonly srOnlyText = input<string>('');
					}
				`,
			});

			expect(names(result['HlmSidebarTrigger'].inputs)).toEqual(['srOnlyText', 'variant']);
		});

		it('exposes a model binding as an input and a <name>Change output', () => {
			const result = extract({
				'libs/brain/foo/src/lib/brn-foo.ts': `
					import { Directive, model } from '@angular/core';
					@Directive({ selector: '[brnFoo]' })
					export class BrnFoo {
						public readonly value = model<number>(0);
					}
				`,
				'libs/helm/foo/src/lib/hlm-foo.ts': `
					import { Directive } from '@angular/core';
					import { BrnFoo } from '@spartan-ng/brain/foo';
					@Directive({
						selector: '[hlmFoo]',
						hostDirectives: [{ directive: BrnFoo, inputs: ['value'], outputs: ['valueChange'] }],
					})
					export class HlmFoo {}
				`,
			});

			expect(names(result['HlmFoo'].inputs)).toEqual(['value']);
			expect(names(result['HlmFoo'].outputs)).toEqual(['valueChange']);
		});

		it('exposes inputs inherited by the referenced directive', () => {
			const result = extract({
				'libs/brain/foo/src/lib/brn-foo.ts': `
					import { Directive, input } from '@angular/core';
					@Directive()
					export class BrnBase {
						public readonly inherited = input<string>('x');
					}
					@Directive({ selector: '[brnFoo]' })
					export class BrnFoo extends BrnBase {
						public readonly own = input<string>('y');
					}
				`,
				'libs/helm/foo/src/lib/hlm-foo.ts': `
					import { Directive } from '@angular/core';
					import { BrnFoo } from '@spartan-ng/brain/foo';
					@Directive({
						selector: '[hlmFoo]',
						hostDirectives: [{ directive: BrnFoo, inputs: ['own', 'inherited'] }],
					})
					export class HlmFoo {}
				`,
			});

			expect(names(result['HlmFoo'].inputs)).toEqual(['own', 'inherited']);
		});

		it('ignores bare directive references (they expose nothing publicly)', () => {
			const result = extract({
				'libs/brain/dialog/src/lib/brn-dialog-close.ts': `
					import { Directive, input } from '@angular/core';
					@Directive({ selector: '[brnDialogClose]' })
					export class BrnDialogClose {
						public readonly hidden = input<boolean>(false);
					}
				`,
				'libs/helm/dialog/src/lib/hlm-dialog-close.ts': `
					import { Directive } from '@angular/core';
					import { BrnDialogClose } from '@spartan-ng/brain/dialog';
					@Directive({ selector: '[hlmDialogClose]', hostDirectives: [BrnDialogClose] })
					export class HlmDialogClose {}
				`,
			});

			// No inputs exposed, and with no other members the class is not emitted at all
			// beyond its selector.
			expect(result['HlmDialogClose'].inputs).toEqual([]);
		});
	});

	describe('class-name collisions', () => {
		it('disambiguates the base class using the import module specifier', () => {
			const result = extract({
				'libs/brain/dialog/src/lib/base.ts': `
					import { Directive, input } from '@angular/core';
					@Directive()
					export class Base {
						public readonly fromBrain = input<string>('brain');
					}
				`,
				'libs/helm/other/src/lib/base.ts': `
					import { Directive, input } from '@angular/core';
					@Directive()
					export class Base {
						public readonly fromHelm = input<string>('helm');
					}
				`,
				'libs/brain/dialog/src/lib/brn-dialog.ts': `
					import { Directive, input } from '@angular/core';
					import { Base } from '@spartan-ng/brain/dialog';
					@Directive({ selector: '[brnDialog]' })
					export class BrnDialog extends Base {
						public readonly own = input<string>('x');
					}
				`,
			});

			// Must inherit from the brain Base, not the helm one that shares the name.
			expect(names(result['BrnDialog'].inputs)).toEqual(['own', 'fromBrain']);
		});
	});
});
