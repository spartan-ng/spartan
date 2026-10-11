import { HlmDataGrid } from './lib/hlm-data-grid';
import { HlmDataGridPagination } from './lib/hlm-data-grid-pagination';

export * from './lib/hlm-data-grid';
export * from './lib/hlm-data-grid-pagination';

export const HlmDataGridImports = [HlmDataGrid, HlmDataGridPagination] as const;
