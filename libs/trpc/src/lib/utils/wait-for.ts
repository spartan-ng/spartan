/* eslint-disable @typescript-eslint/no-empty-function */
import { type Observable, firstValueFrom, isObservable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Zone: any;

export async function waitFor<T>(prom: Promise<T> | Observable<T>): Promise<T> {
	if (isObservable(prom)) {
		prom = firstValueFrom(prom);
	}
	const macroTask = Zone.current.scheduleMacroTask(
		`AnalogContentResolve-${Math.random()}`,
		() => {},
		{},
		() => {},
	);
	return prom.then((p: T) => {
		macroTask.invoke();
		return p;
	});
}
