import { z } from 'zod';

const PASSWORD_REGEX = /^[a-zA-Z\d !"#$%&'()*+,-./:;<=>?@[\]\\^_`{}|~]+$/;

export const UserNameSchema = z.string().min(3).max(255);

export const PasswordSchema = z.string().min(8).max(255).regex(PASSWORD_REGEX);

export const UserCredentialSchema = z.object({
	email: z.string().email(),
	password: PasswordSchema,
});

export const CreateUserSchema = z.object({
	name: UserNameSchema,
	email: z.string().email(),
	password: PasswordSchema,
});
