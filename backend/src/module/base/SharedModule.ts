import { Module } from '@nestjs/common';
import { PrismaClientProvider } from './provider/PrismaClientProvider';

@Module({
	providers: [PrismaClientProvider],
	exports: [PrismaClientProvider],
})
export class SharedModule {}
