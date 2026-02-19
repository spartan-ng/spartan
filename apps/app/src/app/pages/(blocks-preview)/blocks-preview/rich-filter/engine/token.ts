import { InjectionToken } from "@angular/core";
import {  TFieldHandlers } from "./handlers";

/**
 * Injects the object with specific handlers for the filter fields
 */
export const FILTER_HANDLER = new InjectionToken<TFieldHandlers>('FilterHandlerToken');
