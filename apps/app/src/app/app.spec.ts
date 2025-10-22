import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createTrpcClient } from '@spartan-ng/trpc';
import { of } from 'rxjs';
import { App } from './app';

describe('AppComponent', () => {
	beforeEach(async () => {
		const { TrpcClient } = createTrpcClient({
			url: '', // not used
		});

		const mockTrpcClient = {
			github: {
				fetchGithub: { query: () => of({}) },
			},
		};

		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, App],
			providers: [{ provide: TrpcClient, useValue: mockTrpcClient }],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(App);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
