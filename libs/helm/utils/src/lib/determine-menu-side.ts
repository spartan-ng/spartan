import type { CdkContextMenuTrigger, CdkMenu, CdkMenuTrigger } from '@angular/cdk/menu';
import type { ConnectedPosition } from '@angular/cdk/overlay';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getTransformOrigin } from '@spartan-ng/brain/core';

export const setLastPositionOnOpenWithDarkMagic = (cdkTrigger: CdkMenuTrigger | CdkContextMenuTrigger) => {
	// once the trigger opens we wait until the next tick and then grab the last position
	// used to position the menu. we store this in our trigger which the brnMenu directive has
	// access to through DI
	cdkTrigger.opened.pipe(takeUntilDestroyed()).subscribe(() =>
		setTimeout(
			() =>
				// eslint-disable-next-line
				((cdkTrigger as any)._spartanLastPosition = // eslint-disable-next-line
					(cdkTrigger as any).overlayRef._positionStrategy._lastPosition),
		),
	);
};

export const determineMenuSideAndTransformOriginWithDarkMagic = (
	host: CdkMenu,
	renderer: any,
	onSideDetermined: (side: string) => void,
) => {
	/**
	 * This is an ugly workaround to at least figure out the correct side of where a submenu
	 * will appear and set the attribute to the host accordingly
	 *
	 * First of all we take advantage of the menu stack not being aware of the root
	 * object immediately after it is added. This code executes before the root element is added,
	 * which means the stack is still empty and the peek method returns undefined.
	 */
	const isRoot = host.menuStack.peek() === undefined;
	setTimeout(() => {
		// our menu trigger directive leaves the last position used for use immediately after opening
		// we can access it here and determine the correct side.
		// eslint-disable-next-line
		const ps = (host as any)._parentTrigger._spartanLastPosition as ConnectedPosition | undefined;
		let transformOrigin = '';
		if (!ps) {
			// if we have no last position we default to the most likely option
			// I hate that we have to do this and hope we can revisit soon and improve
			onSideDetermined(isRoot ? 'top' : 'left');
			transformOrigin = isRoot ? 'center top' : 'right center';
			renderer.setAttribute(
				host.nativeElement,
				'style',
				`${host.nativeElement.style.cssText} --brn-menu-transform-origin: ${transformOrigin};`,
			);

			return;
		}
		transformOrigin = getTransformOrigin(ps);
		renderer.setAttribute(
			host.nativeElement,
			'style',
			`${host.nativeElement.style.cssText} --brn-menu-transform-origin: ${transformOrigin};`,
		);

		const side = isRoot ? ps.originY : ps.originX === 'end' ? 'right' : 'left';

		onSideDetermined(side);
	});
};
