import { createInjectionToken } from './create-injection-token';

export interface CustomElementClassSettable {
	setClassToCustomElement: (newClass: string) => void;
}

export const [
	injectCustomClassSettable,
	provideCustomClassSettable,
	provideCustomClassSettableExisting,
	SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN,
] = createInjectionToken<CustomElementClassSettable>('@spartan-ng SET_CLASS_TO_CUSTOM_ELEMENT_TOKEN');
