import { Module } from '@nestjs/common';
import { pagesController } from './pages.controller';

@Module({
  imports: [],
  controllers: [pagesController],
})
export class PagesModule {}
