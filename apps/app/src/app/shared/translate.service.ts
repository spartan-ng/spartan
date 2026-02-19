import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class TranslateService {
	public readonly language = signal<'en' | 'ar' | 'he'>('ar');
}
