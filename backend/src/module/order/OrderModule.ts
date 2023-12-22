import { Module } from '@nestjs/common';
import { IamModule } from '@/module/iam/IamModule';
import { OrderController } from './controller/OrderController';
import { OrderRepositoryProvider } from './service/OrderRepository';

// TODO: rename order module to `DeliveryModule`
@Module({
	imports: [IamModule],
	providers: [OrderRepositoryProvider],
	controllers: [OrderController],
	exports: [],
})
export class OrderModule {}
