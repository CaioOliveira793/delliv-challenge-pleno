import { FORM_ERROR_FIELD, FormError } from '@/hook/useForm';
import { CreateUserData, UserCredential } from '@/service/Resource';
import { ResponseType, UnauthorizedType } from '@/service/common';
import { AuthenticateUserError, CreateUserError } from '@/service/iam';
import { handleApiError } from '@/error/ApiErrorHandler';
import { alreadyExists } from '@/formatter/ValidationMessage';

export function handleAuthenticateUserError(
	result: AuthenticateUserError
): FormError<UserCredential>[] {
	switch (result.type) {
		case ResponseType.UNAUTHORIZED: {
			switch (result.value.type) {
				case UnauthorizedType.InvalidPassword:
					return [{ field: 'password', message: 'senha inválida' }];
				case UnauthorizedType.InvalidCredential:
					return [{ field: FORM_ERROR_FIELD, message: 'credenciais inválidas' }];
			}
			break;
		}

		case ResponseType.NOT_FOUND: {
			if (result.value.resource.path === '.email') {
				return [{ field: 'email', message: 'e-mail não encontrado' }];
			}
			return [{ field: FORM_ERROR_FIELD, message: 'usuário não encontrado' }];
		}

		case ResponseType.API_ERROR: {
			handleApiError(result.value);
		}
	}

	return [{ field: FORM_ERROR_FIELD, message: 'sign-in inválido' }];
}

export type SignOutFn = () => void;

export function handleCreateUserError(
	result: CreateUserError,
	signOutFn: SignOutFn
): Array<FormError<CreateUserData>> | void {
	switch (result.type) {
		case ResponseType.UNAUTHORIZED: {
			signOutFn();
			return;
		}

		case ResponseType.CONFLICT: {
			if (result.value.resource.path === '.email') {
				return [{ field: 'email', message: alreadyExists('e-mail') }];
			}
			return [{ field: FORM_ERROR_FIELD, message: alreadyExists('usuário') }];
		}

		case ResponseType.API_ERROR: {
			handleApiError(result.value);
		}
	}
}
