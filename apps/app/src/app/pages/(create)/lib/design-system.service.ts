import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
	COLOR_THEMES,
	DEFAULT_CONFIG,
	FONTS,
	RADII,
	THEMES,
	decodePreset,
	encodePreset,
	getThemesForBaseColor,
	type DesignSystemConfig,
} from '@spartan-ng/registry';
import { map } from 'rxjs/operators';

export type LockableParam =
	| 'style'
	| 'baseColor'
	| 'theme'
	| 'chartColor'
	| 'iconLibrary'
	| 'font'
	| 'fontHeading'
	| 'radius'
	| 'menuAccent'
	| 'menuColor';

const DS_PARAMS: LockableParam[] = [
	'style',
	'baseColor',
	'theme',
	'chartColor',
	'iconLibrary',
	'font',
	'fontHeading',
	'radius',
	'menuAccent',
	'menuColor',
];

interface HistoryEntry {
	config: DesignSystemConfig;
	code: string;
}

@Injectable({ providedIn: 'root' })
export class DesignSystemService {
	private readonly _router = inject(Router);
	private readonly _route = inject(ActivatedRoute);

	private readonly _state = signal<DesignSystemConfig>(DEFAULT_CONFIG);
	public readonly state = this._state.asReadonly();

	public readonly presetCode = computed(() => encodePreset(this._state()));

	public readonly availableThemes = computed(() => {
		return getThemesForBaseColor(this._state().baseColor);
	});

	public readonly availableRadii = computed(() => {
		const style = this._state().style;
		if (style === 'lyra' || style === 'maia') {
			return RADII.filter((r) => r.name === 'none');
		}
		if (style === 'mira') {
			return RADII.filter((r) => r.name !== 'large');
		}
		return [...RADII];
	});

	public readonly darkMode = signal(false);
	public readonly rtl = signal(false);
	public readonly pointer = signal(false);

	private readonly _locks = signal<Set<LockableParam>>(new Set());
	public readonly locks = this._locks.asReadonly();

	private readonly _history = signal<HistoryEntry[]>([]);
	private _historyIndex = -1;

	constructor() {
		this._route.queryParams
			.pipe(
				takeUntilDestroyed(),
				map((params) => this._resolveFromParams(params)),
			)
			.subscribe((config) => {
				if (config) {
					this._state.set(config);
					this._pushHistory(config);
				}
			});
	}

	private _resolveFromParams(params: Record<string, string | undefined>): DesignSystemConfig | null {
		const preset = params['preset'];
		if (preset) {
			const decoded = decodePreset(preset);
			if (decoded) {
				return { ...DEFAULT_CONFIG, ...decoded };
			}
		}

		const hasAnyDsParam = DS_PARAMS.some((p) => params[p] !== undefined);
		if (!hasAnyDsParam) return null;

		return {
			style: (params['style'] as DesignSystemConfig['style']) ?? DEFAULT_CONFIG.style,
			baseColor: (params['baseColor'] as DesignSystemConfig['baseColor']) ?? DEFAULT_CONFIG.baseColor,
			theme: (params['theme'] as DesignSystemConfig['theme']) ?? DEFAULT_CONFIG.theme,
			chartColor: (params['chartColor'] as DesignSystemConfig['chartColor']) ?? DEFAULT_CONFIG.chartColor,
			iconLibrary: (params['iconLibrary'] as DesignSystemConfig['iconLibrary']) ?? DEFAULT_CONFIG.iconLibrary,
			font: (params['font'] as DesignSystemConfig['font']) ?? DEFAULT_CONFIG.font,
			fontHeading: (params['fontHeading'] as DesignSystemConfig['fontHeading']) ?? DEFAULT_CONFIG.fontHeading,
			radius: (params['radius'] as DesignSystemConfig['radius']) ?? DEFAULT_CONFIG.radius,
			menuAccent: (params['menuAccent'] as DesignSystemConfig['menuAccent']) ?? DEFAULT_CONFIG.menuAccent,
			menuColor: (params['menuColor'] as DesignSystemConfig['menuColor']) ?? DEFAULT_CONFIG.menuColor,
		};
	}

	private _pushHistory(config: DesignSystemConfig): void {
		const entry: HistoryEntry = { config: { ...config }, code: encodePreset(config) };
		this._history.update((h) => {
			const trimmed = h.slice(0, this._historyIndex + 1);
			trimmed.push(entry);
			return trimmed.slice(-50);
		});
		this._historyIndex = this._history().length - 1;
	}

	public update(partial: Partial<DesignSystemConfig>): void {
		const updated = { ...this._state(), ...partial };
		this._normalizeConfig(updated);
		this._state.set(updated);
		const code = encodePreset(updated);
		this._pushHistory(updated);
		this._router.navigate([], {
			queryParams: { preset: code },
			queryParamsHandling: 'merge',
			replaceUrl: true,
		});
	}

	private _normalizeConfig(config: DesignSystemConfig): void {
		const available = [...new Set([...THEMES])] as string[];
		if (!available.includes(config.theme)) {
			config.theme = config.baseColor as DesignSystemConfig['theme'];
		}
		if (!available.includes(config.chartColor)) {
			config.chartColor = config.theme;
		}
		if (config.fontHeading === config.font) {
			config.fontHeading = 'inherit';
		}
		if (config.style === 'lyra' || config.style === 'maia') {
			config.radius = 'none';
		} else if (config.style === 'mira' && config.radius === 'large') {
			config.radius = 'default';
		}
	}

	public isLocked(param: LockableParam): boolean {
		return this._locks().has(param);
	}

	public toggleLock(param: LockableParam): void {
		this._locks.update((locks) => {
			const next = new Set(locks);
			if (next.has(param)) {
				next.delete(param);
			} else {
				next.add(param);
			}
			return next;
		});
	}

	public randomize(): void {
		const locks = this._locks();
		const partial: Partial<DesignSystemConfig> = {};

		if (!locks.has('style')) {
			const allStyles = ['nova', 'vega', 'lyra', 'maia', 'mira', 'luma'] as const;
			partial.style = allStyles[Math.floor(Math.random() * allStyles.length)];
		}
		if (!locks.has('baseColor')) {
			const allBase = ['neutral', 'stone', 'zinc', 'gray', 'slate'] as const;
			partial.baseColor = allBase[Math.floor(Math.random() * allBase.length)];
		}
		if (!locks.has('theme')) {
			const allThemes = [...THEMES];
			partial.theme = allThemes[Math.floor(Math.random() * allThemes.length)] as DesignSystemConfig['theme'];
		}
		if (!locks.has('chartColor')) {
			const colors = [...COLOR_THEMES];
			partial.chartColor = colors[Math.floor(Math.random() * colors.length)] as DesignSystemConfig['chartColor'];
		}
		if (!locks.has('iconLibrary')) {
			const allIcons = ['lucide', 'radix', 'phosphor', 'tabler', 'hugeicons'] as const;
			partial.iconLibrary = allIcons[Math.floor(Math.random() * allIcons.length)];
		}
		if (!locks.has('font')) {
			partial.font = FONTS[Math.floor(Math.random() * FONTS.length)];
		}
		if (!locks.has('fontHeading')) {
			partial.fontHeading = Math.random() < 0.7 ? 'inherit' : FONTS[Math.floor(Math.random() * FONTS.length)];
		}
		if (!locks.has('radius')) {
			const radii = this.availableRadii();
			if (radii.length > 0) {
				partial.radius = radii[Math.floor(Math.random() * radii.length)].name;
			}
		}
		if (!locks.has('menuAccent')) {
			partial.menuAccent = Math.random() < 0.5 ? 'subtle' : 'bold';
		}
		if (!locks.has('menuColor')) {
			partial.menuColor = Math.random() < 0.5 ? 'default' : 'inverted';
		}

		this.update(partial);
	}

	public undo(): void {
		if (this._historyIndex > 0) {
			this._historyIndex--;
			const entry = this._history()[this._historyIndex];
			this._state.set({ ...entry.config });
			this._router.navigate([], {
				queryParams: { preset: entry.code },
				queryParamsHandling: 'merge',
				replaceUrl: true,
			});
		}
	}

	public redo(): void {
		if (this._historyIndex < this._history().length - 1) {
			this._historyIndex++;
			const entry = this._history()[this._historyIndex];
			this._state.set({ ...entry.config });
			this._router.navigate([], {
				queryParams: { preset: entry.code },
				queryParamsHandling: 'merge',
				replaceUrl: true,
			});
		}
	}

	public canUndo(): boolean {
		return this._historyIndex > 0;
	}

	public canRedo(): boolean {
		return this._historyIndex < this._history().length - 1;
	}

	public reset(): void {
		this._state.set(DEFAULT_CONFIG);
		const code = encodePreset(DEFAULT_CONFIG);
		this._pushHistory(DEFAULT_CONFIG);
		this._router.navigate([], {
			queryParams: { preset: code },
			queryParamsHandling: 'merge',
			replaceUrl: true,
		});
	}

	public applyPresetCode(code: string): boolean {
		const decoded = decodePreset(code);
		if (!decoded) return false;
		this.update(decoded);
		return true;
	}

	public getShareUrl(): string {
		const url = new URL(window.location.href);
		url.searchParams.set('preset', this.presetCode());
		return url.toString();
	}
}
