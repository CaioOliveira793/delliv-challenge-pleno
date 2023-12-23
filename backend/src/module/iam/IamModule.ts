import { Module } from '@nestjs/common';
import { SharedModule } from '@/module/base/SharedModule';
import { UserController } from '@/module/iam/controller/UserController';
import { JWTService } from '@/module/iam/service/JWTService';
import { AuthController } from '@/module/iam/controller/AuthController';
import { AuthService } from '@/module/iam/service/AuthService';
import { Argon2EncryptionProvider } from '@/module/iam/service/impl/Argon2EncryprionService';
import { JWTEncryptionProvider } from '@/module/iam/service/impl/JWTEncryptionService';
import { UserPrismaRepositoryProvider } from '@/module/iam/service/impl/UserPrismaRepository';
import { CreateUserService } from './usecase/CreateUserService';

@Module({
	imports: [SharedModule],
	providers: [
		JWTService,
		Argon2EncryptionProvider,
		JWTEncryptionProvider,
		UserPrismaRepositoryProvider,

		CreateUserService,

		AuthService,
	],
	controllers: [AuthController, UserController],
	exports: [AuthService, JWTEncryptionProvider],
})
export class IamModule {}
