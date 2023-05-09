import { DrawService } from './draw.service';
// import { DrawEntity } from './entities/draw.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DrawController } from './draw.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [DrawController],
  providers: [DrawService],
  exports: [DrawService],
})
export class DrawModule {}
