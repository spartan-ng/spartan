import { Injectable, signal } from '@angular/core';

export type Language = 'en' | 'ar' | 'he';

export type Direction = 'ltr' | 'rtl';

export type Translations<T extends Record<string, string> = Record<string, string>> = Record<
	Language,
	{
		dir: Direction;
		locale?: string;
		values: T;
	}
>;

@Injectable({
	providedIn: 'root',
})
export class TranslateService {
	public readonly language = signal<Language>('ar');
}
