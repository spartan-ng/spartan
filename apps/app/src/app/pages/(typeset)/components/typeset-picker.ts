import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
	lucideALargeSmall,
	lucideBaseline,
	lucideChevronDown,
	lucideLock,
	lucideLockOpen,
	lucideMoveHorizontal,
	lucideUnfoldVertical,
} from '@ng-icons/lucide';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

export interface TypesetPickerGroup {
	label?: string;
	options: readonly { value: string; label: string }[];
}

@Component({
	selector: 'spartan-typeset-picker',
	imports: [HlmDropdownMenuImports, NgIcon],
	providers: [
		provideIcons({
			lucideALargeSmall,
			lucideMoveHorizontal,
			lucideBaseline,
			lucideChevronDown,
			lucideLock,
			lucideLockOpen,
			lucideUnfoldVertical,
		}),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'group/picker relative block w-full',
	},
	template: `
		<button
			type="button"
			[hlmDropdownMenuTrigger]="menu"
			side="right"
			align="start"
			(hlmDropdownMenuClosed)="previewClear.emit()"
			class="ring-foreground/10 hover:bg-muted focus-visible:ring-foreground/50 relative w-full cursor-pointer touch-manipulation rounded-lg p-2.5 text-start ring-1 transition-colors select-none focus-visible:outline-none"
		>
			<span class="flex min-w-0 flex-col items-start gap-0.5 pe-10">
				<span class="text-muted-foreground text-xs">{{ label() }}</span>
				<span class="max-w-full truncate text-sm font-medium" [style.font-family]="fontFamily()">
					{{ _selectedLabel() }}
				</span>
			</span>

			<span
				class="text-foreground pointer-events-none absolute end-2.5 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center select-none"
			>
				@if (fontFamily()) {
					<span class="text-base" [style.font-family]="fontFamily()">Aa</span>
				} @else if (icon()) {
					<ng-icon [name]="icon()" class="size-4.5" />
				} @else {
					<ng-icon name="lucideChevronDown" class="size-4" />
				}
			</span>
		</button>

		<ng-template #menu>
			<hlm-dropdown-menu class="max-h-96 w-56" (mouseleave)="previewClear.emit()">
				@for (group of groups(); track group.label ?? $index) {
					<hlm-dropdown-menu-group>
						@if (group.label) {
							<hlm-dropdown-menu-label>{{ group.label }}</hlm-dropdown-menu-label>
						}
						@for (option of group.options; track option.value) {
							<button
								hlmDropdownMenuRadio
								type="button"
								[checked]="value() === option.value"
								[keepOpen]="false"
								(mouseenter)="optionPreview.emit(option.value)"
								(triggered)="_select(option.value)"
							>
								{{ option.label }}
								<hlm-dropdown-menu-radio-indicator />
							</button>
						}
					</hlm-dropdown-menu-group>
				}
			</hlm-dropdown-menu>
		</ng-template>

		<button
			type="button"
			[attr.title]="locked() ? 'Unlock' : 'Lock'"
			[attr.aria-label]="locked() ? 'Unlock' : 'Lock'"
			[attr.data-locked]="locked()"
			(click)="lockChange.emit()"
			class="text-foreground ring-foreground/60 absolute end-8 top-1/2 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded opacity-0 transition-opacity outline-none group-focus-within/picker:opacity-100 group-hover/picker:opacity-100 focus:opacity-100 focus-visible:ring-1 data-[locked=true]:opacity-100 max-md:hidden pointer-coarse:hidden"
		>
			<ng-icon [name]="locked() ? 'lucideLock' : 'lucideLockOpen'" class="size-5" />
		</button>
	`,
})
export class TypesetPicker {
	public readonly label = input.required<string>();
	public readonly value = input.required<string>();
	public readonly groups = input.required<readonly TypesetPickerGroup[]>();
	public readonly fontFamily = input<string>('');
	public readonly icon = input<string>('');
	public readonly locked = input(false);

	public readonly valueChange = output<string>();
	public readonly optionPreview = output<string>();
	public readonly previewClear = output<void>();
	public readonly lockChange = output<void>();

	protected _select(value: string): void {
		this.previewClear.emit();
		this.valueChange.emit(value);
	}

	protected readonly _selectedLabel = computed(() => {
		for (const group of this.groups()) {
			const option = group.options.find((item) => item.value === this.value());
			if (option) return option.label;
		}
		return this.value();
	});
}
