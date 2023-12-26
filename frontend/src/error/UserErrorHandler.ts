import { FORM_ERROR_FIELD, FormError } from '@/hook/useForm';
import { UserCredential } from '@/service/Resource';
import { ResponseType, UnauthorizedType } from '@/service/common';
import { AuthenticateUserError } from '@/service/iam';
import { handleApiError } from './ApiErrorHandler';

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
