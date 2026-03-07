import { signal, type Type } from '@angular/core';
import type { ExternalToast, HeightT, PromiseData, PromiseT, ToastT, ToastTypes } from './types';

let toastsCounter = 0;

function createToastState() {
	const toasts = signal<ToastT[]>([]);
	const heights = signal<HeightT[]>([]);

	function addToast(data: ToastT) {
		toasts.update((prev) => [data, ...prev]);
	}

	function create(
		data: ExternalToast & {
			message?: string | Type<unknown>;
			type?: ToastTypes;
			promise?: PromiseT;
		},
	) {
		const { message, ...rest } = data;
		const id = typeof data?.id === 'number' || (data.id && data.id?.length > 0) ? data.id : toastsCounter++;

		const dismissible = data.dismissible ?? true;
		const type = data.type ?? 'default';

		const alreadyExists = toasts().find((toast) => toast.id === id);

		if (alreadyExists) {
			toasts.update((prev) =>
				prev.map((toast) => {
					if (toast.id === id) {
						return {
							...toast,
							...data,
							id,
							title: message,
							dismissible,
							type,
							updated: true,
						};
					} else return { ...toast, updated: false };
				}),
			);
		} else {
			addToast({ ...rest, id, title: message, dismissible: dismissible, type });
		}

		return id;
	}

	function dismiss(id?: number | string) {
		if (id === undefined) {
			toasts.set([]);
			return;
		}
		toasts.update((prev) => prev.filter((toast) => toast.id !== id));

		return id;
	}

	function message(message: string | Type<unknown>, data?: ExternalToast) {
		return create({ ...data, type: 'default', message });
	}

	function error(message: string | Type<unknown>, data?: ExternalToast) {
		return create({ ...data, type: 'error', message });
	}

	function success(message: string | Type<unknown>, data?: ExternalToast) {
		return create({ ...data, type: 'success', message });
	}

	function info(message: string | Type<unknown>, data?: ExternalToast) {
		return create({ ...data, type: 'info', message });
	}

	function warning(message: string | Type<unknown>, data?: ExternalToast) {
		return create({ ...data, type: 'warning', message });
	}

	function loading(message: string | Type<unknown>, data?: ExternalToast) {
		return create({ ...data, type: 'loading', message });
	}

	function promise<ToastData>(promise: PromiseT<ToastData>, data?: PromiseData<ToastData>) {
		if (!data) return;

		let id: string | number | undefined = undefined;
		if (data.loading !== undefined) {
			id = create({
				...data,
				promise,
				type: 'loading',
				message: data.loading,
			});
		}

		const p = promise instanceof Promise ? promise : promise();

		let shouldDismiss = id !== undefined;

		p.then((response) => {
			// @ts-expect-error: Incorrect response type
			if (response && typeof response.ok === 'boolean' && !response.ok) {
				shouldDismiss = false;

				const message =
					typeof data.error === 'function'
						? // @ts-expect-error: TODO: Better function checking
							data.error(`HTTP error! status: ${response.status}`)
						: data.error;
				create({ id, type: 'error', message });
			} else if (data.success !== undefined) {
				shouldDismiss = false;

				const message =
					typeof data.success === 'function'
						? // @ts-expect-error: TODO: Better function checking
							data.success(response)
						: data.success;
				create({ id, type: 'success', message });
			}
		})
			.catch((error) => {
				if (data.error !== undefined) {
					shouldDismiss = false;
					const message =
						// @ts-expect-error: TODO: Better function checking
						typeof data.error === 'function' ? data.error(error) : data.error;
					create({ id, type: 'error', message });
				}
			})
			.finally(() => {
				if (shouldDismiss) {
					// Toast is still in load state (and will be indefinitely — dismiss it)
					dismiss(id);
					id = undefined;
				}

				data.finally?.();
			});

		return id;
	}

	function custom<T>(component: Type<T>, data?: ExternalToast) {
		const id = data?.id ?? toastsCounter++;
		create({ component, id, ...data });

		return id;
	}

	function removeHeight(id: number | string) {
		heights.update((prev) => prev.filter((height) => height.toastId !== id));
	}

	function addHeight(height: HeightT) {
		heights.update((prev) => [height, ...prev].sort(sortHeights));
	}

	const sortHeights = (a: HeightT, b: HeightT) =>
		toasts().findIndex((t) => t.id === a.toastId) - toasts().findIndex((t) => t.id === b.toastId);

	function reset() {
		toasts.set([]);
		heights.set([]);
	}

	return {
		//methods
		create,
		addToast,
		dismiss,
		message,
		error,
		success,
		info,
		warning,
		loading,
		promise,
		custom,
		removeHeight,
		addHeight,
		reset,
		// signals
		toasts: toasts.asReadonly(),
		heights: heights.asReadonly(),
	};
}

export const toastState = createToastState();

// bind this to the toast function
function toastFunction(message: string | Type<unknown>, data?: ExternalToast) {
	return toastState.create({
		message,
		...data,
	});
}

const basicToast = toastFunction;

export const toast = Object.assign(basicToast, {
	success: toastState.success,
	info: toastState.info,
	warning: toastState.warning,
	error: toastState.error,
	custom: toastState.custom,
	message: toastState.message,
	promise: toastState.promise,
	dismiss: toastState.dismiss,
	loading: toastState.loading,
});
