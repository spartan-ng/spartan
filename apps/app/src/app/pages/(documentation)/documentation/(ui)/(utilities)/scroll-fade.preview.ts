import { ChangeDetectionStrategy, Component } from '@angular/core';

const items = (count: number) => Array.from({ length: count }, (_, i) => `Item ${i + 1}`);

const edgeItems = ['Inbox triage', 'Design review', 'API contract', 'QA pass', 'Launch notes', 'Metrics follow-up'];

const tags = [
	'Design',
	'Engineering',
	'Marketing',
	'Product',
	'Research',
	'Sales',
	'Support',
	'Operations',
	'Finance',
	'Legal',
	'People',
	'Security',
];

const edgeTags = tags.slice(0, 8);

const rtlTags = ['تصميم', 'هندسة', 'تسويق', 'منتج', 'أبحاث', 'مبيعات', 'دعم', 'عمليات', 'مالية', 'قانوني'];

@Component({
	selector: 'spartan-scroll-fade-preview',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'mx-auto block w-full max-w-xs overflow-hidden rounded-2xl border' },
	template: `
		<div class="scroll-fade no-scrollbar h-72 overflow-y-auto">
			<div class="flex flex-col gap-1.5 p-1.5">
				@for (item of _items; track item) {
					<div class="bg-muted rounded-lg px-3 py-2.5 text-sm">{{ item }}</div>
				}
			</div>
		</div>
	`,
})
export class ScrollFadePreview {
	protected readonly _items = items(12);
}

export const scrollFadeDemoCode = `<div class="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border">
  <div class="scroll-fade no-scrollbar h-72 overflow-y-auto">
    <div class="flex flex-col gap-1.5 p-1.5">
      @for (item of items; track item) {
        <div class="bg-muted rounded-lg px-3 py-2.5 text-sm">{{ item }}</div>
      }
    </div>
  </div>
</div>`;

@Component({
	selector: 'spartan-scroll-fade-overflow-preview',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'mx-auto block w-full max-w-xs overflow-hidden rounded-2xl border' },
	template: `
		<div class="scroll-fade no-scrollbar overflow-y-auto">
			<div class="flex flex-col gap-1.5 p-1.5">
				@for (item of _items; track item) {
					<div class="bg-muted rounded-lg px-3 py-2.5 text-sm">{{ item }}</div>
				}
			</div>
		</div>
	`,
})
export class ScrollFadeOverflowPreview {
	protected readonly _items = items(3);
}

export const scrollFadeOverflowCode = `<div class="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border">
  <div class="scroll-fade no-scrollbar overflow-y-auto">
    <div class="flex flex-col gap-1.5 p-1.5">
      @for (item of items; track item) {
        <div class="bg-muted rounded-lg px-3 py-2.5 text-sm">{{ item }}</div>
      }
    </div>
  </div>
</div>`;

@Component({
	selector: 'spartan-scroll-fade-x-preview',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'mx-auto block w-full max-w-xs overflow-hidden rounded-2xl border' },
	template: `
		<div class="scroll-fade-x no-scrollbar overflow-x-auto">
			<div class="flex w-max gap-1.5 p-1.5">
				@for (tag of _tags; track tag) {
					<div class="bg-muted shrink-0 rounded-lg px-3 py-2.5 text-sm">{{ tag }}</div>
				}
			</div>
		</div>
	`,
})
export class ScrollFadeXPreview {
	protected readonly _tags = tags;
}

export const scrollFadeXCode = `<div class="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border">
  <div class="scroll-fade-x no-scrollbar overflow-x-auto">
    <div class="flex w-max gap-1.5 p-1.5">
      @for (tag of tags; track tag) {
        <div class="bg-muted shrink-0 rounded-lg px-3 py-2.5 text-sm">{{ tag }}</div>
      }
    </div>
  </div>
</div>`;

@Component({
	selector: 'spartan-scroll-fade-edges-preview',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'mx-auto flex max-w-xs min-w-0 flex-col gap-6' },
	template: `
		<div class="flex flex-col gap-3">
			<div class="overflow-hidden rounded-2xl border">
				<div class="scroll-fade-t no-scrollbar h-36 overflow-y-auto">
					<div class="flex flex-col gap-1.5 p-1.5">
						@for (item of _items; track item) {
							<div class="bg-muted rounded-lg px-3 py-2.5 text-sm">{{ item }}</div>
						}
					</div>
				</div>
			</div>
			<p class="text-muted-foreground text-center font-mono text-xs">scroll-fade-t</p>
		</div>
		<div class="flex flex-col gap-3">
			<div class="overflow-hidden rounded-2xl border">
				<div class="scroll-fade-b no-scrollbar h-36 overflow-y-auto">
					<div class="flex flex-col gap-1.5 p-1.5">
						@for (item of _items; track item) {
							<div class="bg-muted rounded-lg px-3 py-2.5 text-sm">{{ item }}</div>
						}
					</div>
				</div>
			</div>
			<p class="text-muted-foreground text-center font-mono text-xs">scroll-fade-b</p>
		</div>
		<div class="flex flex-col gap-3">
			<div class="overflow-hidden rounded-2xl border">
				<div class="scroll-fade-s no-scrollbar overflow-x-auto">
					<div class="flex w-max gap-1.5 p-1.5">
						@for (tag of _tags; track tag) {
							<div class="bg-muted shrink-0 rounded-lg px-3 py-2.5 text-sm">{{ tag }}</div>
						}
					</div>
				</div>
			</div>
			<p class="text-muted-foreground text-center font-mono text-xs">scroll-fade-s</p>
		</div>
		<div class="flex flex-col gap-3">
			<div class="overflow-hidden rounded-2xl border">
				<div class="scroll-fade-e no-scrollbar overflow-x-auto">
					<div class="flex w-max gap-1.5 p-1.5">
						@for (tag of _tags; track tag) {
							<div class="bg-muted shrink-0 rounded-lg px-3 py-2.5 text-sm">{{ tag }}</div>
						}
					</div>
				</div>
			</div>
			<p class="text-muted-foreground text-center font-mono text-xs">scroll-fade-e</p>
		</div>
	`,
})
export class ScrollFadeEdgesPreview {
	protected readonly _items = edgeItems;
	protected readonly _tags = edgeTags;
}

export const scrollFadeEdgesCode = `<div class="scroll-fade-b no-scrollbar h-36 overflow-y-auto">
  <!-- fade only on the bottom edge -->
</div>

<div class="scroll-fade-s no-scrollbar overflow-x-auto">
  <!-- logical start edge; mirrors in RTL -->
</div>`;

@Component({
	selector: 'spartan-scroll-fade-size-preview',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'mx-auto flex w-full max-w-xs flex-col gap-6' },
	template: `
		<div class="flex flex-col gap-3">
			<div class="overflow-hidden rounded-2xl border">
				<div class="scroll-fade scroll-fade-4 no-scrollbar h-48 overflow-y-auto">
					<div class="flex flex-col gap-1.5 p-1.5">
						@for (item of _items; track item) {
							<div class="bg-muted rounded-lg px-3 py-2.5 text-sm">{{ item }}</div>
						}
					</div>
				</div>
			</div>
			<p class="text-muted-foreground text-center font-mono text-xs">scroll-fade-4</p>
		</div>
		<div class="flex flex-col gap-3">
			<div class="overflow-hidden rounded-2xl border">
				<div class="scroll-fade scroll-fade-24 no-scrollbar h-48 overflow-y-auto">
					<div class="flex flex-col gap-1.5 p-1.5">
						@for (item of _items; track item) {
							<div class="bg-muted rounded-lg px-3 py-2.5 text-sm">{{ item }}</div>
						}
					</div>
				</div>
			</div>
			<p class="text-muted-foreground text-center font-mono text-xs">scroll-fade-24</p>
		</div>
	`,
})
export class ScrollFadeSizePreview {
	protected readonly _items = items(8);
}

export const scrollFadeSizeCode = `<div class="scroll-fade scroll-fade-24 no-scrollbar h-48 overflow-y-auto">
  <!-- fixed fade depth on the spacing scale -->
</div>`;

@Component({
	selector: 'spartan-scroll-fade-none-preview',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'mx-auto flex max-w-xs min-w-0 flex-col gap-6' },
	template: `
		<div class="flex flex-col gap-3">
			<div class="overflow-hidden rounded-2xl border">
				<div class="scroll-fade no-scrollbar h-48 overflow-y-auto">
					<div class="flex flex-col gap-1.5 p-1.5">
						@for (item of _items; track item) {
							<div class="bg-muted rounded-lg px-3 py-2.5 text-sm">{{ item }}</div>
						}
					</div>
				</div>
			</div>
			<p class="text-muted-foreground text-center font-mono text-xs">scroll-fade</p>
		</div>
		<div class="flex flex-col gap-3">
			<div class="overflow-hidden rounded-2xl border">
				<div class="scroll-fade scroll-fade-none no-scrollbar h-48 overflow-y-auto">
					<div class="flex flex-col gap-1.5 p-1.5">
						@for (item of _items; track item) {
							<div class="bg-muted rounded-lg px-3 py-2.5 text-sm">{{ item }}</div>
						}
					</div>
				</div>
			</div>
			<p class="text-muted-foreground text-center font-mono text-xs">scroll-fade scroll-fade-none</p>
		</div>
	`,
})
export class ScrollFadeNonePreview {
	protected readonly _items = items(8);
}

export const scrollFadeNoneCode = `<div class="scroll-fade overflow-y-auto md:scroll-fade-none">
  <!-- disable the fade responsively or by state -->
</div>`;

@Component({
	selector: 'spartan-scroll-fade-rtl-preview',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'mx-auto block w-full max-w-xs overflow-hidden rounded-2xl border', dir: 'rtl' },
	template: `
		<div class="scroll-fade-x no-scrollbar overflow-x-auto">
			<div class="flex w-max gap-1.5 p-1.5">
				@for (tag of _tags; track tag) {
					<div class="bg-muted shrink-0 rounded-lg px-3 py-2.5 text-sm">{{ tag }}</div>
				}
			</div>
		</div>
	`,
})
export class ScrollFadeRtlPreview {
	protected readonly _tags = rtlTags;
}

export const scrollFadeRtlCode = `<div class="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border" dir="rtl">
  <div class="scroll-fade-x no-scrollbar overflow-x-auto">
    <div class="flex w-max gap-1.5 p-1.5">
      @for (tag of tags; track tag) {
        <div class="bg-muted shrink-0 rounded-lg px-3 py-2.5 text-sm">{{ tag }}</div>
      }
    </div>
  </div>
</div>`;
