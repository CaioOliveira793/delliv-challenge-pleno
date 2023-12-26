import { Module } from '@nestjs/common';
import { SharedModule } from '@/module/base/SharedModule';
import { IamModule } from '@/module/iam/IamModule';
import { OrderPrismaRepositoryProvider } from '@/module/delivery/service/impl/OrderPrismaRepository';
import { OrderController } from '@/module/delivery/controller/OrderController';
import { DeliveryEventController } from '@/module/delivery/controller/DeliveryEventController';

@Module({
	imports: [SharedModule, IamModule],
	providers: [OrderPrismaRepositoryProvider],
	controllers: [OrderController, DeliveryEventController],
	exports: [],
})
export class DeliveryModule {}
