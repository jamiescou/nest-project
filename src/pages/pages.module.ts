import { Module } from '@nestjs/common';
import { pagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { UserModule } from '../user/user.module';
import { PostsModule } from '../posts/posts.module';
import { CardModule } from '../card/card.module';

@Module({
  imports: [UserModule, PostsModule, CardModule],
  providers: [PagesService],
  controllers: [pagesController],
})
export class PagesModule {}
