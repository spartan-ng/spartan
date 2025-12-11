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
	| 'autocomplete'
	| 'avatar'
	| 'badge'
	| 'breadcrumb'
	| 'button'
	| 'button-group'
	| 'calendar'
	| 'card'
	| 'carousel'
	| 'checkbox'
	| 'collapsible'
	| 'command'
	| 'context-menu'
	| 'date-picker'
	| 'dialog'
	| 'empty'
	| 'field'
	| 'form-field'
	| 'hover-card'
	| 'icon'
	| 'input'
	| 'input-group'
	| 'input-otp'
	| 'item'
	| 'dropdown-menu'
	| 'label'
	| 'menubar'
	| 'pagination'
	| 'popover'
	| 'progress'
	| 'radio-group'
	| 'scroll-area'
	| 'select'
	| 'separator'
	| 'sheet'
	| 'sidebar'
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
