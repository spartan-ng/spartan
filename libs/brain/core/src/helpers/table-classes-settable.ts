import { createInjectionToken } from './create-injection-token';

export interface TableClassesSettable {
	setTableClasses: (classes: Partial<{ table: string; headerRow: string; bodyRow: string }>) => void;
}

export const [
	injectTableClassesSettable,
	provideTableClassesSettable,
	provideTableClassesSettableExisting,
	SET_TABLE_CLASSES_TOKEN,
] = createInjectionToken<TableClassesSettable>('@spartan-ng SET_TABLE_CLASSES_TOKEN');
