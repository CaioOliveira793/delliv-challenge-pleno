export const InvalidTypeMessage = 'Invalid type';
export const RequiredValueMessage = 'Required value';

export function uniqueConstraintViolationMessage(constraint: string) {
	return `ERROR: duplicate key violates unique constraint "${constraint}".`;
}
