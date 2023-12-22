import { Module } from '@nestjs/common';
import { IamModule } from '@/module/iam/IamModule';
import { OrderPrismaRepositoryProvider } from '@/module/order/service/impl/OrderPrismaRepository';
import { DeliveryEventPrismaRepositoryProvider } from '@/module/order/service/impl/DeliveryEventPrismaRepository';
import { OrderController } from '@/module/order/controller/OrderController';
import { DeliveryEventController } from '@/module/order/controller/DeliveryEventController';

// TODO: rename order module to `DeliveryModule`
@Module({
	imports: [IamModule],
	providers: [OrderPrismaRepositoryProvider, DeliveryEventPrismaRepositoryProvider],
	controllers: [OrderController, DeliveryEventController],
	exports: [],
})
export class OrderModule {}
