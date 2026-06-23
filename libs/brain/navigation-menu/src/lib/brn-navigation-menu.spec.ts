import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { render, type RenderResult, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BrnNavigationMenu } from './brn-navigation-menu';
import { BrnNavigationMenuContent } from './brn-navigation-menu-content';
import { BrnNavigationMenuItem } from './brn-navigation-menu-item';
import { BrnNavigationMenuLink } from './brn-navigation-menu-link';
import { BrnNavigationMenuList } from './brn-navigation-menu-list';
import { BrnNavigationMenuTrigger } from './brn-navigation-menu-trigger';

const BrnNavigationMenuImports = [
	BrnNavigationMenu,
	BrnNavigationMenuItem,
	BrnNavigationMenuList,
	BrnNavigationMenuTrigger,
	BrnNavigationMenuContent,
	BrnNavigationMenuLink,
] as const;

@Component({
	selector: 'brn-navigation-menu-spec',
	imports: [BrnNavigationMenuImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<nav brnNavigationMenu [orientation]="orientation()">
			<ul brnNavigationMenuList>
				<li brnNavigationMenuItem id="item1">
					<button brnNavigationMenuTrigger data-testid="trigger1">One</button>
					<div *brnNavigationMenuContent data-testid="content1">
						<a brnNavigationMenuLink href="#" data-testid="c1-link1">C1 L1</a>
						<a brnNavigationMenuLink href="#" data-testid="c1-link2">C1 L2</a>
						<a brnNavigationMenuLink href="#" data-testid="c1-link3">C1 L3</a>
					</div>
				</li>
				<li brnNavigationMenuItem id="item2">
					<button brnNavigationMenuTrigger data-testid="trigger2" [disabled]="disabledTwo()">Two</button>
					<div *brnNavigationMenuContent data-testid="content2">
						<a brnNavigationMenuLink href="#" data-testid="c2-link1">C2 L1</a>
						<a brnNavigationMenuLink href="#" data-testid="c2-link2">C2 L2</a>
					</div>
				</li>
				<li brnNavigationMenuItem id="item3">
					<a brnNavigationMenuLink href="#" data-testid="link3">Three</a>
				</li>
			</ul>
		</nav>
	`,
})
class NavigationMenuSpec {
	public readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
	public readonly disabledTwo = signal(false);
	public readonly nav = viewChild.required(BrnNavigationMenu);
}

@Component({
	selector: 'brn-nested-navigation-menu-spec',
	imports: [BrnNavigationMenuImports],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<nav brnNavigationMenu>
			<ul brnNavigationMenuList>
				<li brnNavigationMenuItem id="root1">
					<button brnNavigationMenuTrigger data-testid="root-trigger">Root</button>
					<div *brnNavigationMenuContent data-testid="root-content">
						<nav brnNavigationMenu orientation="vertical">
							<ul brnNavigationMenuList>
								<li brnNavigationMenuItem id="sub1">
									<button brnNavigationMenuTrigger data-testid="sub-trigger1">Sub One</button>
									<div *brnNavigationMenuContent data-testid="sub-content1">
										<a brnNavigationMenuLink href="#" data-testid="s1-link1">S1 L1</a>
										<a brnNavigationMenuLink href="#" data-testid="s1-link2">S1 L2</a>
									</div>
								</li>
								<li brnNavigationMenuItem id="sub2">
									<button brnNavigationMenuTrigger data-testid="sub-trigger2">Sub Two</button>
									<div *brnNavigationMenuContent data-testid="sub-content2">
										<a brnNavigationMenuLink href="#" data-testid="s2-link1">S2 L1</a>
									</div>
								</li>
							</ul>
						</nav>
					</div>
				</li>
			</ul>
		</nav>
	`,
})
class NestedNavigationMenuSpec {}

function key(target: HTMLElement, init: Partial<KeyboardEventInit> & { key: string }) {
	target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }));
}

describe('BrnNavigationMenu', () => {
	let view: RenderResult<NavigationMenuSpec>;

	const setup = async (orientation: 'horizontal' | 'vertical' = 'horizontal') => {
		view = await render(NavigationMenuSpec);
		if (orientation !== 'horizontal') {
			view.fixture.componentInstance.orientation.set(orientation);
			view.detectChanges();
		}
		return view;
	};

	// Opens an item by driving the controlled value, then waits for the portaled content to attach.
	const open = async (itemId: string, contentTestId: string) => {
		view.fixture.componentInstance.nav().value.set(itemId);
		view.detectChanges();
		return screen.findByTestId(contentTestId);
	};

	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	describe('aria wiring', () => {
		it('does not reference a content panel while closed', async () => {
			await setup();
			const trigger = screen.getByTestId('trigger1');

			expect(screen.queryByTestId('content1')).not.toBeInTheDocument();
			expect(trigger).toHaveAttribute('aria-expanded', 'false');
			expect(trigger).not.toHaveAttribute('aria-controls');
		});

		it('references the rendered content while open and labels it by the trigger', async () => {
			await setup();
			const trigger = screen.getByTestId('trigger1');
			const content = await open('item1', 'content1');

			expect(trigger).toHaveAttribute('aria-expanded', 'true');
			expect(trigger).toHaveAttribute('aria-controls', content.id);
			expect(content).toHaveAttribute('aria-labelledby', trigger.id);
		});

		it('exposes orientation and a navigation label on the root', async () => {
			await setup();
			const nav = screen.getByRole('navigation');
			expect(nav).toHaveAttribute('aria-label', 'Main');
			expect(nav).toHaveAttribute('data-orientation', 'horizontal');
		});
	});

	describe('open / close', () => {
		it('toggles the panel on trigger click', async () => {
			const user = userEvent.setup();
			await setup();
			const trigger = screen.getByTestId('trigger1');

			await user.click(trigger);
			expect(await screen.findByTestId('content1')).toBeInTheDocument();

			await user.click(trigger);
			await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
		});

		it('closes on Escape and returns focus to the trigger', async () => {
			await setup();
			const trigger = screen.getByTestId('trigger1');
			await open('item1', 'content1');

			const firstLink = screen.getByTestId('c1-link1');
			firstLink.focus();
			key(firstLink, { key: 'Escape' });
			view.detectChanges();

			expect(document.activeElement).toBe(trigger);
			expect(trigger).toHaveAttribute('aria-expanded', 'false');
		});
	});

	describe('keyboard entry into content', () => {
		it('moves focus into the panel when tabbing from the trigger', async () => {
			await setup();
			const trigger = screen.getByTestId('trigger1');
			await open('item1', 'content1');

			trigger.focus();
			key(trigger, { key: 'Tab' });

			expect(document.activeElement).toBe(screen.getByTestId('c1-link1'));
		});

		it('enters the panel with ArrowDown in a horizontal menu', async () => {
			await setup('horizontal');
			const trigger = screen.getByTestId('trigger1');
			await open('item1', 'content1');

			trigger.focus();
			key(trigger, { key: 'ArrowDown' });

			expect(document.activeElement).toBe(screen.getByTestId('c1-link1'));
		});

		it('enters the panel with ArrowRight in a vertical menu', async () => {
			await setup('vertical');
			const trigger = screen.getByTestId('trigger1');
			await open('item1', 'content1');

			trigger.focus();
			key(trigger, { key: 'ArrowRight' });

			expect(document.activeElement).toBe(screen.getByTestId('c1-link1'));
		});
	});

	describe('tabbing within content', () => {
		it('walks forward to the next item', async () => {
			await setup();
			await open('item1', 'content1');

			const first = screen.getByTestId('c1-link1');
			first.focus();
			key(first, { key: 'Tab' });

			expect(document.activeElement).toBe(screen.getByTestId('c1-link2'));
		});

		it('walks backward to the previous item', async () => {
			await setup();
			await open('item1', 'content1');

			const second = screen.getByTestId('c1-link2');
			second.focus();
			key(second, { key: 'Tab', shiftKey: true });

			expect(document.activeElement).toBe(screen.getByTestId('c1-link1'));
		});

		it('returns focus to the trigger on Shift+Tab from the first item', async () => {
			await setup();
			const trigger = screen.getByTestId('trigger1');
			await open('item1', 'content1');

			const first = screen.getByTestId('c1-link1');
			first.focus();
			key(first, { key: 'Tab', shiftKey: true });

			expect(document.activeElement).toBe(trigger);
		});
	});

	describe('tabbing out of content (issue #1484)', () => {
		it('moves focus to the next top-level trigger after the last item', async () => {
			await setup();
			await open('item1', 'content1');

			const last = screen.getByTestId('c1-link3');
			last.focus();
			key(last, { key: 'Tab' });
			view.detectChanges();

			// Focus stays in the menu flow on the next trigger instead of escaping to the page.
			expect(document.activeElement).toBe(screen.getByTestId('trigger2'));
			expect(screen.getByTestId('trigger1')).toHaveAttribute('aria-expanded', 'false');
		});

		it('skips a disabled sibling when tabbing out', async () => {
			await setup();
			view.fixture.componentInstance.disabledTwo.set(true);
			view.detectChanges();
			await open('item1', 'content1');

			const last = screen.getByTestId('c1-link3');
			last.focus();
			key(last, { key: 'Tab' });
			view.detectChanges();

			expect(document.activeElement).toBe(screen.getByTestId('link3'));
		});
	});
});

describe('BrnNavigationMenu (nested)', () => {
	let nestedView: RenderResult<NestedNavigationMenuSpec>;

	// Native click() toggles the panel deterministically without the pointer/hover side effects of userEvent.
	const click = async (triggerTestId: string, contentTestId: string) => {
		screen.getByTestId(triggerTestId).click();
		return screen.findByTestId(contentTestId);
	};

	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('reveals the nested menu when the root panel opens', async () => {
		nestedView = await render(NestedNavigationMenuSpec);

		await click('root-trigger', 'root-content');
		expect(screen.getByTestId('sub-trigger1')).toBeInTheDocument();
		expect(screen.getByTestId('sub-trigger2')).toBeInTheDocument();
	});

	it('opens a nested panel and keeps the root panel open', async () => {
		nestedView = await render(NestedNavigationMenuSpec);

		await click('root-trigger', 'root-content');
		await click('sub-trigger1', 'sub-content1');

		expect(screen.getByTestId('root-content')).toBeInTheDocument();
		expect(screen.getByTestId('sub-trigger1')).toHaveAttribute('aria-expanded', 'true');
	});

	it('tabs out of a nested panel to the next nested trigger (issue #1484)', async () => {
		nestedView = await render(NestedNavigationMenuSpec);

		await click('root-trigger', 'root-content');
		await click('sub-trigger1', 'sub-content1');

		const last = screen.getByTestId('s1-link2');
		last.focus();
		key(last, { key: 'Tab' });
		nestedView.detectChanges();

		expect(document.activeElement).toBe(screen.getByTestId('sub-trigger2'));
	});
});
