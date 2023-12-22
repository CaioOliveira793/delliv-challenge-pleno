import { PrismaClient } from '@prisma/client';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariables, NodeEnv } from '@/config/Environment';

export const PRISMA_CLIENT_PROVIDER = 'SHARED/PRISMA_CLIENT_PROVIDER';

export const PrismaClientProvider: Provider<PrismaClient> = {
	provide: PRISMA_CLIENT_PROVIDER,
	useFactory: (configService: ConfigService<EnvVariables, true>) => {
		const datasourceUrl = configService.get<string>('DATABASE_URL');
		switch (configService.get<NodeEnv>('NODE_ENV')) {
			case 'production':
				return new PrismaClient({
					datasourceUrl,
					log: ['warn', 'error'],
				});

			default:
				return new PrismaClient({
					datasourceUrl,
					log: ['query', 'info', 'warn', 'error'],
				});
		}
	},
	inject: [ConfigService],
};
