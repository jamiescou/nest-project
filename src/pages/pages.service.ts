import { UserService } from '../user/user.service';
import { PostsService } from '../posts/posts.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PagesService {
  constructor(
    private userService: UserService,
    private postsService: PostsService,
  ) {}

  async findOneUser(id: string, _body?: any) {
    console.log(_body);
    return await this.userService.findOne(id);
  }
  async findOnePosts(id: string, _body?: any) {
    console.log(_body);
    return await this.postsService.findById(id);
  }
  //   async findAll(data: any) {
  //     return await this.userService.findAll(data);
  //   }
}
