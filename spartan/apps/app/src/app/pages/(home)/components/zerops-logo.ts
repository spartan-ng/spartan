import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import type { ClassValue } from 'clsx';

@Component({
	selector: 'spartan-zerops-logo',
	template: `
		<svg [class]="_computedClass()" viewBox="0 0 43 51" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clip-path="url(#clip0_509_87)">
				<path
					d="M19.73 0.26L2.54 6.83C1.79041 7.12387 1.14696 7.63712 0.693778 8.30261C0.240602 8.9681 -0.00119685 9.75486 4.45458e-06 10.56V27.1L7.9 22.56V13.26L21.14 8.18V0C20.6582 0.00103777 20.1805 0.0891191 19.73 0.26Z"
					fill="currentFill"
				/>
				<path
					d="M8.04 37.2999L21.14 29.7499V20.6299L0.9 32.2999C0.627546 32.4595 0.401307 32.6872 0.243513 32.9608C0.0857184 33.2343 0.00179874 33.5441 0 33.8599V39.9699C0.00680324 40.7682 0.252331 41.5462 0.70499 42.2038C1.15765 42.8614 1.79673 43.3685 2.54 43.6599L19.73 50.2299C20.1805 50.4008 20.6582 50.4888 21.14 50.4899V42.3099L8.04 37.2999Z"
					fill="currentFill"
				/>
				<path
					d="M41.4399 18.03C41.6982 17.8821 41.9123 17.6678 42.06 17.4093C42.2077 17.1509 42.2836 16.8577 42.2799 16.56V10.56C42.2811 9.75486 42.0393 8.9681 41.5861 8.30261C41.1329 7.63712 40.4895 7.12387 39.7399 6.83L22.5399 0.26C22.0925 0.0902993 21.6184 0.00223757 21.1399 0V8.18L34.1399 13.18L21.1399 20.67V29.79L41.4399 18.03Z"
					fill="currentColor"
				/>
				<path
					d="M22.5399 50.23L39.7399 43.66C40.4832 43.3686 41.1222 42.8615 41.5749 42.2039C42.0276 41.5463 42.2731 40.7683 42.2799 39.97V23.26L34.3799 27.82V37.25L21.1399 42.31V50.49C21.6184 50.4878 22.0925 50.3997 22.5399 50.23Z"
					fill="currentColor"
				/>
			</g>
			<defs>
				<clipPath id="clip0_509_87">
					<rect width="42.27" height="50.48" fill="white" />
				</clipPath>
			</defs>
		</svg>
	`,
})
export class ZeropsLogo {
	public readonly class = input<ClassValue>('');
	protected readonly _computedClass = computed(() =>
		hlm('fill-primary-foreground/70 text-primary-foreground h-full w-full', this.class()),
	);
}
