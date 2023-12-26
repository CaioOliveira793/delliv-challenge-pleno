import { ApiError, ApiErrorType } from '@/service/common';

export type SignOutFn = () => void;

// TODO: replace alert for a user notification system

export function handleApiError(error: ApiError): void {
	switch (error.type) {
		case ApiErrorType.Aborted: {
			alert('Operação abortada');
			return;
		}
		case ApiErrorType.NetworkError: {
			alert('Um error na rede foi encontrado: ' + error.message);
			return;
		}
		case ApiErrorType.InvalidFetchCall:
		case ApiErrorType.InvalidResponseBody:
		case ApiErrorType.UnknownResponse:
		case ApiErrorType.UnknownError: {
			console.error(error);
		}
	}
}
