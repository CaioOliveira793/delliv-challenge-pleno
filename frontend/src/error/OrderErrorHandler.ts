import { GetOrderError, ListOrderError } from '@/service/order';
import { SignOutFn, handleApiError } from '@/error/ApiErrorHandler';
import { FORM_ERROR_FIELD, FormError } from '@/hook/useForm';
import { ResponseType } from '@/service/common';
import { OrderQuery } from '@/service/Resource';

export function handleGetOrderError(result: GetOrderError, signOutFn: SignOutFn): boolean {
	switch (result.type) {
		case ResponseType.UNAUTHORIZED: {
			signOutFn();
			return false;
		}

		case ResponseType.NOT_FOUND: {
			return true;
		}

		case ResponseType.API_ERROR: {
			handleApiError(result.value);
		}
	}

	return false;
}

export function handleListOrderError(
	result: ListOrderError,
	signOutFn: SignOutFn
): FormError<OrderQuery>[] {
	switch (result.type) {
		case ResponseType.UNAUTHORIZED: {
			signOutFn();
			return [];
		}

		case ResponseType.API_ERROR: {
			handleApiError(result.value);
		}
	}

	return [{ field: FORM_ERROR_FIELD, message: 'erro ao listar os pedidos' }];
}
