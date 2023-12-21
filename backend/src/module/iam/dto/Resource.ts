import { User } from '@/module/iam/entity/User';

export interface UserCredential {
	email: string;
	password: string;
}

export interface UserResource {
	id: string;
	created: Date;
	updated: Date;
	name: string;
	email: string;
	last_authentication: Date;
}

export interface AuthResponse {
	token: string;
	user: UserResource;
}

export function makeUserResource(user: User): UserResource {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		last_authentication: user.lastAuth,
		created: user.created,
		updated: user.updated,
	};
}
