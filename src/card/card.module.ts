import { AuthModule } from '../auth/auth.module';
import { MDMiddleware } from '../core/middleware/md.middleware';
import { TagModule } from '../tag/tag.module';
import { CategoryModule } from '../category/category.module';
import { CardEntity } from './card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardEntity]),
    CategoryModule,
    TagModule,
    AuthModule,
  ],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MDMiddleware)
      .forRoutes({ path: 'card', method: RequestMethod.POST });
  }
}
