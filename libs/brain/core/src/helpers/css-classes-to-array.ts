export function cssClassesToArray(classes: string | string[] | null | undefined, defaultClass = ''): string[] {
	const value = classes ?? defaultClass;
	return (Array.isArray(value) ? value : [value]).flatMap((className) => className.split(/\s+/).filter(Boolean));
}
