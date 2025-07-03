export interface PropertyMetadata {
	name: string;
	type: string;
	description: string;
	defaultValue?: string | null; // Made optional since outputs don't have defaultValue
}

export interface ComponentMetadata {
	file: string;
	inputs: PropertyMetadata[];
	models: PropertyMetadata[];
	outputs: PropertyMetadata[];
	selector?: string | null;
	exportAs?: string | null;
}

export type LibraryComponents = Record<string, ComponentMetadata>;

export type Primitives =
	| 'accordion'
	| 'alert'
	| 'alert-dialog'
	| 'aspect-ratio'
	| 'avatar'
	| 'badge'
	| 'breadcrumb'
	| 'button'
	| 'calendar'
	| 'card'
	| 'carousel'
	| 'checkbox'
	| 'collapsible'
	| 'command'
	| 'date-picker'
	| 'dialog'
	| 'form-field'
	| 'hover-card'
	| 'icon'
	| 'input'
	| 'input-otp'
	| 'label'
	| 'menu'
	| 'pagination'
	| 'popover'
	| 'progress'
	| 'radio-group'
	| 'scroll-area'
	| 'select'
	| 'separator'
	| 'sheet'
	| 'skeleton'
	| 'slider'
	| 'sonner'
	| 'spinner'
	| 'switch'
	| 'table'
	| 'tabs'
	| 'toggle'
	| 'toggle-group'
	| 'tooltip'
	| 'typography';

export type LibraryType = 'brain' | 'helm';

export type ComponentApiData = Record<Primitives, Partial<Record<LibraryType, LibraryComponents>>>;
