import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

const EXAMPLES_TASK_SETTINGS_KEY = 'spartan-examples';

const DEFAULT_TASK_TABLE_COLUMNS = ['id', 'title', 'status', 'priority'];

/**
 * Manages local storage settings for the task table.
 * It persists the users selected columns.
 */
@Injectable({
	providedIn: 'root',
})
export class LocalStorageService {
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	private readonly _settings = {
		taskTable: {
			selectedColumns: this.getSelectedColumnsSettings(EXAMPLES_TASK_SETTINGS_KEY) ?? DEFAULT_TASK_TABLE_COLUMNS,
		},
	};

	saveTaskTableColumn(value: any): void {
		this._settings.taskTable.selectedColumns.push(value);
		this.updateSettings(EXAMPLES_TASK_SETTINGS_KEY, this._settings.taskTable);
	}

	deleteTaskTableColumn(value: any): void {
		this._settings.taskTable.selectedColumns = this._settings.taskTable.selectedColumns.filter(
			(column: any) => column !== value,
		);
		this.updateSettings(EXAMPLES_TASK_SETTINGS_KEY, this._settings.taskTable);
	}

	getTaskTableColumns(): string[] {
		return this._settings.taskTable.selectedColumns;
	}

	private updateSettings(key: string, settings: any) {
		if (this._isBrowser) {
			localStorage.setItem(key, JSON.stringify(settings));
		}
	}

	private getSelectedColumnsSettings(key: string) {
		if (!this._isBrowser) {
			return DEFAULT_TASK_TABLE_COLUMNS;
		}
		const settings = localStorage.getItem(key);
		if (!settings) {
			return undefined;
		}
		return JSON.parse(settings).selectedColumns;
	}
}
