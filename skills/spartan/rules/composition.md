# Component composition

Most spartan components are made of several directives/components that must be nested correctly.
Import the per-component `*Imports` const (e.g. `HlmDialogImports`, `HlmCardImports`) and add it to
your standalone component's `imports`. Always confirm selectors via the docs or MCP before writing
templates - the examples below are canonical but APIs evolve.

## Items belong inside their group

- `hlm-select-item` goes inside `hlm-select-content` (and optionally `hlm-select-group`).
- `button[hlmToggleGroupItem]` goes inside `hlm-toggle-group`.
- `button[hlmTabsTrigger]` goes inside `hlm-tabs-list`.
- Accordion: `hlm-accordion-trigger` and `hlm-accordion-content` go inside `hlm-accordion-item`,
  which goes inside `hlm-accordion`.

## Overlays need a title

Dialog, Sheet, and Alert Dialog must have a title for accessibility. If the design hides it, keep it
present and apply `class="sr-only"`.

```html
<hlm-dialog>
	<button hlmDialogTrigger hlmBtn>Edit profile</button>
	<hlm-dialog-content *hlmDialogPortal class="sm:max-w-[425px]">
		<hlm-dialog-header>
			<h3 hlmDialogTitle>Edit profile</h3>
			<p hlmDialogDescription>Make changes to your profile here.</p>
		</hlm-dialog-header>
		<div class="py-4">
			<input hlmInput placeholder="Name" />
		</div>
		<hlm-dialog-footer>
			<button hlmBtn hlmDialogClose>Save changes</button>
		</hlm-dialog-footer>
	</hlm-dialog-content>
</hlm-dialog>
```

Sheet mirrors this (`hlmSheetTrigger`, `*hlmSheetPortal`, `hlm-sheet-content`, `hlm-sheet-header`,
`hlmSheetTitle`). The `side` input (`top | bottom | left | right`) goes on the root `<hlm-sheet>`
element, not on the content: `<hlm-sheet side="right">`.

## Full Card composition

Use the structural pieces rather than styling a bare `div`.

```html
<section hlmCard>
	<div hlmCardHeader>
		<h3 hlmCardTitle>Create project</h3>
		<p hlmCardDescription>Deploy in one click.</p>
	</div>
	<div hlmCardContent>...</div>
	<div hlmCardFooter class="justify-between">
		<button hlmBtn variant="ghost">Cancel</button>
		<button hlmBtn>Create</button>
	</div>
</section>
```

## Tabs

```html
<hlm-tabs tab="account">
	<hlm-tabs-list>
		<button hlmTabsTrigger="account">Account</button>
		<button hlmTabsTrigger="password">Password</button>
	</hlm-tabs-list>
	<div hlmTabsContent="account">...</div>
	<div hlmTabsContent="password">...</div>
</hlm-tabs>
```

## Avatar always has a fallback

```html
<hlm-avatar>
	<img hlmAvatarImage src="/avatar.jpg" alt="Jane Doe" />
	<span hlmAvatarFallback>JD</span>
</hlm-avatar>
```

## Buttons have no loading input

There is no `isLoading`/`isPending` input on `hlmBtn`. Compose a `hlm-spinner` and disable the
button:

```html
<button hlmBtn [disabled]="saving()">
	@if (saving()) {
	<hlm-spinner />
	} Save
</button>
```

## Use components, not custom markup

- Callouts / inline messages -> `hlmAlert` (with `hlmAlertTitle` / `hlmAlertDescription`).
- Empty states -> `hlm-empty` (`hlmEmptyMedia`, `hlmEmptyTitle`, `hlmEmptyDescription`).
- Toasts -> the `sonner` component: place `<hlm-toaster />` once, then call `toast(...)` from
  `@spartan-ng/brain/sonner` (`toast.success`, `toast.error`, etc.).
- Dividers -> `hlm-separator`, not `<hr>`.
- Loading placeholders -> `hlmSkeleton`, not custom pulsing divs.
- Status pills -> `hlmBadge`, not custom styled spans.
- Loading indicator -> `hlm-spinner`.
