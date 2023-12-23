import { Module } from '@nestjs/common';
import { PrismaServiceProvider } from '@/module/base/service/PrismaService';

@Module({
	providers: [PrismaServiceProvider],
	exports: [PrismaServiceProvider],
})
export class SharedModule {}
