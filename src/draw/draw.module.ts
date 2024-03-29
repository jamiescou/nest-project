import { AuthModule } from './../auth/auth.module';
import { DrawService } from './draw.service';
import { HttpModule } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
import { DrawEntity } from './entities/draw.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DrawController } from './draw.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([DrawEntity]),
    DrawEntity,
    HttpModule,
    AuthModule,
  ],
  controllers: [DrawController],
  providers: [DrawService],
  exports: [DrawService],
})
export class DrawModule {}
