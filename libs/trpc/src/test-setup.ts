import '@analogjs/vite-plugin-angular/setup-vitest';
import '@angular/compiler';
import { NgModule, provideZoneChangeDetection } from '@angular/core';

/**
 * Initialize TestBed for all tests inside of router
 */
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

@NgModule({ providers: [provideZoneChangeDetection()] })
export class ZoneChangeDetectionModule {}

TestBed.initTestEnvironment([ZoneChangeDetectionModule, BrowserDynamicTestingModule], platformBrowserDynamicTesting());
