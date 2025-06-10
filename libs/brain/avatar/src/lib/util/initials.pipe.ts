import { Pipe, type PipeTransform } from '@angular/core';

const toInitial =
	(capitalize = true) =>
	(word: string) => {
		const initial = word.charAt(0);
		return capitalize ? initial.toLocaleUpperCase() : initial;
	};

const firstAndLast = (initials: string[]) => `${initials[0]}${initials[initials.length - 1]}`;

@Pipe({
	name: 'initials',
})
export class InitialsPipe implements PipeTransform {
	transform(name: string, capitalize = true, firstAndLastOnly = true, delimiter = ' '): string {
		if (!name) return '';

		const initials = name.trim().split(delimiter).filter(Boolean).map(toInitial(capitalize));

		if (firstAndLastOnly && initials.length > 1) return firstAndLast(initials);

		return initials.join('');
	}
}
