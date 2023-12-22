import { z } from 'zod';
import { PersonNameSchema } from '@/validation/Schema';

const PASSWORD_REGEX = /^[a-zA-Z\d !"#$%&'()*+,-./:;<=>?@[\]\\^_`{}|~]+$/;

export const PasswordSchema = z.string().min(8).max(255).regex(PASSWORD_REGEX);

export const UserCredentialSchema = z.object({
	email: z.string().email(),
	password: PasswordSchema,
});

export const CreateUserSchema = z.object({
	name: PersonNameSchema,
	email: z.string().email(),
	password: PasswordSchema,
});
