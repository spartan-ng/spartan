/* eslint-disable @typescript-eslint/naming-convention */
import { APP_BOOTSTRAP_LISTENER, ApplicationRef, InjectionToken, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

export const tRPC_CACHE_STATE = new InjectionToken<{
	isCacheActive: BehaviorSubject<boolean>;
}>('TRPC_HTTP_TRANSFER_STATE_CACHE_STATE');

export const provideTrpcCacheState = () => ({
	provide: tRPC_CACHE_STATE,
	useValue: { isCacheActive: new BehaviorSubject(true) },
});

export const provideTrpcCacheStateStatusManager = () => ({
	provide: APP_BOOTSTRAP_LISTENER,
	multi: true,
	useFactory: () => {
		const appRef = inject(ApplicationRef);
		const cacheState = inject(tRPC_CACHE_STATE);

		return () =>
			appRef.isStable.pipe(first((isStable) => isStable)).subscribe(() => cacheState.isCacheActive.next(false));
	},
	deps: [ApplicationRef, tRPC_CACHE_STATE],
});
