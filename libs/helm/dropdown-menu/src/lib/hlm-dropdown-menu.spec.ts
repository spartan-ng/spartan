import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { MenuSide } from '@spartan-ng/brain/core';
import { render, screen } from '@testing-library/angular';
import { HlmDropdownMenu } from './hlm-dropdown-menu';
import { HlmDropdownMenuItem } from './hlm-dropdown-menu-item';
import { HlmDropdownMenuTrigger } from './hlm-dropdown-menu-trigger';

// CDK sets transform-origin async on attach and the content reads it one tick later.
const flush = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await new Promise((resolve) => setTimeout(resolve, 0));
};

@Component({
	selector: 'hlm-dropdown-menu-host',
	imports: [HlmDropdownMenuTrigger, HlmDropdownMenu, HlmDropdownMenuItem],
	providers: [Directionality],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<button [hlmDropdownMenuTrigger]="menu" [side]="side()">Open</button>
		<ng-template #menu>
			<hlm-dropdown-menu>
				<button hlmDropdownMenuItem>Item</button>
			</hlm-dropdown-menu>
		</ng-template>
	`,
})
class DropdownMenuHost {
	public readonly side = input<MenuSide>('bottom');
}

describe('HlmDropdownMenu data-side', () => {
	const open = async (side: MenuSide) => {
		await render(DropdownMenuHost, { componentInputs: { side } });
		screen.getByText('Open').click();
		await flush();
		return document.querySelector('[data-slot="dropdown-menu"]');
	};

	afterEach(() => {
		document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
	});

	it('derives a vertical data-side for a vertically placed menu', async () => {
		const content = await open('bottom');
		expect(content).toBeTruthy();
		expect(['top', 'bottom']).toContain(content?.getAttribute('data-side'));
	});

	// Proves the configured side reaches the portaled content through DI: a horizontal placement must
	// produce a horizontal data-side. If the MENU_SIDE wiring broke, the content would fall back to the
	// vertical default and this would read 'top'/'bottom' instead.
	it('derives a horizontal data-side from the trigger side', async () => {
		const content = await open('right');
		expect(content).toBeTruthy();
		expect(['left', 'right']).toContain(content?.getAttribute('data-side'));
	});
});
