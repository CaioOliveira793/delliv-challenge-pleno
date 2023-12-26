import { APP_FILTER, RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createGlobalConfigOptions } from '@/config/ConfigOptions';
import { HttpExceptionFilter } from '@/exception/HttpExceptionFilter';
import { SharedModule } from '@/module/base/SharedModule';
import { IamModule } from '@/module/iam/IamModule';
import { DeliveryModule } from '@/module/delivery/DeliveryModule';

@Module({
	imports: [
		ConfigModule.forRoot(createGlobalConfigOptions()),
		SharedModule,
		IamModule,
		DeliveryModule,
		RouterModule.register([
			{ path: 'iam', module: IamModule },
			{ path: 'delivery', module: DeliveryModule },
		]),
	],
	providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}
