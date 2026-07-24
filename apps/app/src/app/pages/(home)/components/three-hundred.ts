import { Component, computed, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { ThreeHundredItem } from './th-item';
import { ThreeHundredItemPlaceholder } from './th-item-placeholder';

/** Number of contributors shown before "Show all" is clicked. Divisible by 3/5/10 so it fills clean rows at every breakpoint. */
const COLLAPSED_COUNT = 30;

@Component({
	selector: 'spartan-three-hundred',
	imports: [ThreeHundredItem, ThreeHundredItemPlaceholder, HlmButton],
	host: {
		class: 'relative flex flex-col items-center gap-6',
	},
	template: `
		<div class="relative w-full">
			<div class="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-10">
				@for (contributor of _visibleContributors(); track $index) {
					<spartan-th-item class="mb-2" [contributor]="contributor" />
				}
				@if (_expanded()) {
					@for (_ of _rest; track $index) {
						<spartan-th-item-placeholder class="mb-2 hidden md:inline-flex" />
					}
				}
			</div>
			@if (!_expanded()) {
				<div class="from-background pointer-events-none absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t"></div>
			}
		</div>
		@if (_contributors.length > _collapsedCount) {
			<button hlmBtn variant="outline" size="sm" (click)="_expanded.set(!_expanded())">
				{{ _expanded() ? 'Show fewer' : 'Show all ' + _contributors.length + ' contributors' }}
			</button>
		}
	`,
})
export class ThreeHundred {
	protected readonly _expanded = signal(false);
	protected readonly _visibleContributors = computed(() =>
		this._expanded() ? this._contributors : this._contributors.slice(0, COLLAPSED_COUNT),
	);
	protected readonly _collapsedCount = COLLAPSED_COUNT;

	protected readonly _contributors = [
		'goetzrobin',
		'thatsamsonkid',
		'elite-benni',
		'ashley-hunter',
		'marcjulian',
		'MerlinMoos',
		'zeropsio',
		'snyder-tech',
		'mihajm',
		'ajitzero',
		'arturgawlik',
		'deepakrudrapaul',
		'evanfuture',
		'AdditionAddict',
		'Altamimi-Dev',
		'ferat',
		'jeremy-js-devweb',
		'heddendorp',
		'tutkli',
		'Pascalmh',
		'okkindel',
		'oidre',
		'nartc',
		'santoshyadavdev',
		'markostanimirovic',
		'theo-matzavinos',
		'jkuri',
		'dongphuong0905',
		'DominikPieper',
		'brandonroberts',
		'izikd',
		'ryancraigmartin',
		'gaetanBloch',
		'gergobergo',
		'rpacheco124',
		'benjaminforras',
		'jstnjs',
		'r3ps4J',
		'Celtian',
		'miljan-code',
		'alexciesielski',
		'ty-ler',
		'm-risto',
		'badsgahhl',
		'monacodelisa',
		'tomdev9',
		'ragul1697',
		'kkamman',
		'i-am-the-slime',
		'DevWedeloper',
		'mrsofiane',
		'mateoetchepare',
		'DonaldMurillo',
		'toniskobic',
		'eneajaho',
		'Den-dp',
		'0xfraso',
		'Muneersahel',
		'danilolmc',
		'tomalaforge',
		'canserkanuren',
		'cjosue15',
		'hirenchauhan2',
		'Roguyt',
		'tsironis13',
		'guillermoecharri',
		'ValentinFunk',
		'Femi236',
		'dineshkp',
		'robingenz',
		'Balastrong',
		'OlegSuncrown',
		'stewones',
		'shinkhouse',
		'donaldxdonald',
		'BenoitPE',
		'Georg632',
		'hillin',
		'Besbash',
		'davidedammino',
		'marcindz88',
		'thyco',
		'hitro11',
		'GODrums',
		'samsonkumawong',
		'PR4SAN',
		'JeevanMahesha',
		'dlhck',
		'tomer953',
		'drdreo',
		'tlandenberger',
		'yackinn',
		'OmerGronich',
		'kubalinio',
		'AlexHladin',
		'CO97',
		'MatanShushan',
		'maxhov',
		'josueggh',
		'namdien177',
		'zelenchuk',
		'a-malacarne',
		'YasinKuralay',
		'nico13051995',
		'francotalarico',
		'koenigderluegner',
		'Turtl3e',
		'minhnguyen120898',
		'liam-langstaff',
		'dw-0',
		'Khumozin',
		'abiramcodes',
		'garygrossgarten',
		'Oussemasahbeni',
		'benpsnyder',
		'dhwani1806',
		'elite-lucas',
		'esteecodes',
		'felhag',
		'notsufferbutbutter',
		'vlrjuan',
		'Dafnik',
		'hassantayyab',
		'mathwizard',
		'RaminGe',
		'abos-gergo',
		'jpsullivan',
		'ayangabryl',
		's-froghyar',
		'aziz-zina',
		'avihayAsus',
		'multignite',
		'sefatanam',
		'LinboLen',
		'Oneill19',
		'homj',
		'Musta-Pollo',
		'mitja-kurath',
		'alisterpineda',
		'amitshalev2',
		'SOG-web',
		'Joebeurg',
		'mehrabix',
		'PatrickLarocque',
		'Ban117',
		'gerasidev',
		'Nicoss54',
		'xonaib',
		'SocDario',
		'bcl-dev',
		'skolldev',
	];
	protected readonly _contributorCountRoundedToNextMultipleOf10 = Math.ceil(this._contributors.length / 10) * 10;
	protected readonly _countNeededToGetToNextMultipleOf10 =
		this._contributorCountRoundedToNextMultipleOf10 - this._contributors.length;
	protected readonly _rest = Array(this._countNeededToGetToNextMultipleOf10 + 20).map((_, i) => i);
}
