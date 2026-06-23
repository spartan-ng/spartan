import { booleanAttribute, Component, input } from '@angular/core';

@Component({
	selector: 'spartan-logo',
	host: {
		class: 'flex items-center justify-center',
	},
	template: `
		<svg class="logo-legacy:hidden max-h-6 w-full" viewBox="0 0 873 923" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M351.019 572.876L436.247 619.524L521.474 572.876L480.551 498.463L559.034 431.269L436.247 22.0439L313.459 431.269L391.942 498.463L351.019 572.876Z"
				[attr.fill]="flat() ? '#DD0031' : 'url(#paint0_linear_1019_272)'"
			/>
			@if (!flat()) {
				<path
					d="M351.019 572.876L436.247 619.524L521.474 572.876L480.551 498.463L559.034 431.269L436.247 22.0439L313.459 431.269L391.942 498.463L351.019 572.876Z"
					fill="url(#paint1_radial_1019_272)"
				/>
			}
			<path
				d="M873 153.885L841.477 648.314L540.078 0L873 153.885ZM664.241 793.208L436.502 923L208.759 793.208L255.079 681.084H617.921L664.241 793.208ZM31.2009 648.314L0 153.885L332.922 0L31.2009 648.314Z"
				[attr.fill]="flat() ? '#DD0031' : 'url(#paint2_linear_1019_272)'"
			/>
			<path
				d="M370.772 546.67L435.924 582.342L501.076 546.67L469.792 489.766L529.789 438.382L435.924 125.445L342.059 438.382L402.056 489.766L370.772 546.67Z"
				[attr.fill]="flat() ? '#DD0031' : 'url(#paint3_linear_1019_272)'"
			/>
			@if (!flat()) {
				<path
					d="M873 153.885L841.477 648.314L540.078 0L873 153.885ZM664.241 793.208L436.502 923L208.759 793.208L255.079 681.084H617.921L664.241 793.208ZM31.2009 648.314L0 153.885L332.922 0L31.2009 648.314Z"
					fill="url(#paint4_radial_1019_272)"
				/>
				<path
					d="M370.772 546.67L435.924 582.342L501.076 546.67L469.792 489.766L529.789 438.382L435.924 125.445L342.059 438.382L402.056 489.766L370.772 546.67Z"
					fill="url(#paint5_radial_1019_272)"
				/>
				<defs>
					<linearGradient
						id="paint0_linear_1019_272"
						x1="-134"
						y1="843.838"
						x2="1222.51"
						y2="646.408"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#75011D" />
						<stop offset="0.526" stop-color="#A30024" />
						<stop offset="1" stop-color="#DD0031" />
					</linearGradient>
					<radialGradient
						id="paint1_radial_1019_272"
						cx="0"
						cy="0"
						r="1"
						gradientTransform="matrix(-913.077 788.538 -790.215 -912.594 1140.12 -142)"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#DD0031" />
						<stop offset="0.707" stop-color="#DB0030" stop-opacity="0.5" />
						<stop offset="1" stop-color="#DB0030" stop-opacity="0" />
					</radialGradient>
					<linearGradient
						id="paint2_linear_1019_272"
						x1="-2.84247e-06"
						y1="753.876"
						x2="1037"
						y2="603"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#75011D" />
						<stop offset="0.526" stop-color="#A30024" />
						<stop offset="1" stop-color="#DD0031" />
					</linearGradient>
					<linearGradient
						id="paint3_linear_1019_272"
						x1="-2.84247e-06"
						y1="753.876"
						x2="1037"
						y2="603"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#75011D" />
						<stop offset="0.526" stop-color="#A30024" />
						<stop offset="1" stop-color="#DD0031" />
					</linearGradient>
					<radialGradient
						id="paint4_radial_1019_272"
						cx="0"
						cy="0"
						r="1"
						gradientTransform="matrix(-698 603 -604.079 -697.866 974 1.14292e-05)"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#DD0031" />
						<stop offset="0.707" stop-color="#DB0030" stop-opacity="0.5" />
						<stop offset="1" stop-color="#DB0030" stop-opacity="0" />
					</radialGradient>
					<radialGradient
						id="paint5_radial_1019_272"
						cx="0"
						cy="0"
						r="1"
						gradientTransform="matrix(-698 603 -604.079 -697.866 974 1.14292e-05)"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#DD0031" />
						<stop offset="0.707" stop-color="#DB0030" stop-opacity="0.5" />
						<stop offset="1" stop-color="#DB0030" stop-opacity="0" />
					</radialGradient>
				</defs>
			}
		</svg>

		<svg class="logo-legacy:block hidden w-full" viewBox="0 0 630 268" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M191.5 244.5L560 135L191.5 23.5L126.5 98.5L69.5 62L24 137.5L64.5 211L131 174.5L191.5 244.5Z"
				fill="#DD0031"
			/>
			<path
				d="M562.848 144.586L594.816 135.087L562.896 125.429L194.396 13.9285L188.19 12.0506L183.943 16.9507L124.586 85.4401L74.3593 53.5573L65.7181 48.0721L60.4351 56.8383L14.9351 132.338L11.9592 137.276L14.7416 142.326L55.2416 215.826L60.0445 224.542L68.7839 219.781L128.705 187.138L183.934 251.039L188.157 255.925L194.348 254.086L562.848 144.586Z"
				stroke="#36000D"
				stroke-width="20"
			/>
			<path d="M23.5 137.5L64 211L131 174.5L191.5 244.5L560.891 135L23.5 137.5Z" fill="#75011D" />
			<path
				d="M260.533 136L260.533 170.86L199 187.374L199 218L474 136.141L473.527 136L384.145 136L384.651 136.141L298.463 160.134L298.463 136L260.533 136Z"
				fill="#DD0031"
			/>
			<path
				d="M260.533 136L260.533 101.14L199 84.6265L199 54L474 135.859L473.527 136L384.145 136L384.651 135.859L298.463 111.866L298.463 136L260.533 136Z"
				fill="#75011D"
			/>
		</svg>
	`,
})
export class SpartanLogo {
	/** Render a solid-fill mark without gradient <defs> - used where multiple logos render at once (e.g. the
	 *  300-item placeholder) so the gradient ids stay unique to the single header instance. */
	public readonly flat = input(false, { transform: booleanAttribute });
}
