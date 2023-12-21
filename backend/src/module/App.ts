import { APP_FILTER, RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createGlobalConfigOptions } from '@/config/ConfigOptions';
import { HttpExceptionFilter } from '@/exception/HttpExceptionFilter';
import { IamModule } from '@/module/iam/IamModule';

@Module({
	imports: [
		ConfigModule.forRoot(createGlobalConfigOptions()),
		IamModule,
		RouterModule.register([{ path: 'iam', module: IamModule }]),
	],
	providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}
