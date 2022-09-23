import { Module } from '@nestjs/common';
import { pagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { UserModule } from '../user/user.module';
import { PostsModule } from '../posts/posts.module';
@Module({
  imports: [UserModule, PostsModule],
  providers: [PagesService],
  controllers: [pagesController],
})
export class PagesModule {}
