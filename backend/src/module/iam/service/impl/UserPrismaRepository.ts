import { Inject, Injectable, Provider } from '@nestjs/common';
import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { User, UserState } from '@/module/iam/entity/User';
import { USER_REPOSITORY_PROVIDER, UserRepository } from '@/module/iam/service/UserRepository';
import { PRISMA_CLIENT_PROVIDER } from '@/module/base/provider/PrismaClientProvider';

function dbToUserState(dbuser: PrismaUser): UserState {
	return {
		created: dbuser.created,
		updated: dbuser.updated,
		name: dbuser.name,
		email: dbuser.email,
		passwordHash: dbuser.password_hash,
		lastAuth: dbuser.last_authentication,
	};
}

@Injectable()
export class UserPrismaRepository implements UserRepository {
	private readonly prisma: PrismaClient;

	constructor(
		@Inject(PRISMA_CLIENT_PROVIDER)
		prisma: PrismaClient
	) {
		this.prisma = prisma;
	}

	public async insert(user: User): Promise<void> {
		await this.prisma.user.create({
			data: {
				id: user.id,
				created: user.created,
				updated: user.updated,
				email: user.email,
				name: user.name,
				password_hash: user.passwordHash,
				last_authentication: user.lastAuth,
			},
		});
	}

	public async find(id: string): Promise<User | null> {
		const dbuser = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!dbuser) return null;
		return User.restore(dbuser.id, dbToUserState(dbuser));
	}

	public async findByEmail(email: string): Promise<User | null> {
		const dbuser = await this.prisma.user.findUnique({
			where: { email },
		});

		if (!dbuser) return null;
		return User.restore(dbuser.id, dbToUserState(dbuser));
	}

	public async update(user: User): Promise<void> {
		await this.prisma.user.update({
			where: { id: user.id },
			data: {
				updated: user.updated,
				name: user.name,
				email: user.email,
				password_hash: user.passwordHash,
			},
		});
	}

	public async updateLastAuth(id: string, lastAuth: Date): Promise<void> {
		await this.prisma.user.update({
			where: { id },
			data: {
				last_authentication: lastAuth,
			},
		});
	}
}

export const UserPrismaRepositoryProvider: Provider<UserRepository> = {
	provide: USER_REPOSITORY_PROVIDER,
	useClass: UserPrismaRepository,
};
