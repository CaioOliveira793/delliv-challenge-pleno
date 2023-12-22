import { EntityID } from '@/module/base/Entity';
import { User } from '@/module/iam/entity/User';

export interface UserRepository {
	insert(user: User): Promise<void>;
	find(id: EntityID): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	update(user: User): Promise<void>;
	updateLastAuth(id: string, lastAuth: Date): Promise<void>;
}

export const USER_REPOSITORY_PROVIDER = 'IAM/USER_REPOSITORY_PROVIDER';
