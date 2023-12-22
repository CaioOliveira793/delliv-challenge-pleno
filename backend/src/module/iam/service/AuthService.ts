import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedError, UnauthorizedType } from '@/exception/security/UnauthorizedError';
import { User } from '@/module/iam/entity/User';
import { Token } from '@/module/iam/type/Token';
import { USER_REPOSITORY_PROVIDER, UserRepository } from '@/module/iam/service/UserRepository';

@Injectable()
export class AuthService {
	constructor(
		@Inject(USER_REPOSITORY_PROVIDER)
		private readonly userRepository: UserRepository
	) {}

	public async getAuthenticatedUser(token: Token<string>): Promise<User> {
		const user = await this.userRepository.find(token.data);
		if (!user) {
			throw new UnauthorizedError('Invalid token', UnauthorizedType.InvalidToken);
		}

		return user;
	}
}
