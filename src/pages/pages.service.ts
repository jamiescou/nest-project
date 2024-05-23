import { UserService } from '../user/user.service';
import { PostsService } from '../posts/posts.service';
import { CardService } from '../card/card.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PagesService {
  constructor(
    private userService: UserService,
    private postsService: PostsService,
    private cardService: CardService,
  ) {}

  async findOneInfo(pid: string, uid: string, _body?: any) {
    console.log(_body);
    if (pid) {
      return await this.postsService.findById(pid);
    }
    return await this.userService.findOne(uid);
  }

  async findCardInfo(id: string, _body?: any) {
    console.log('findCardInfo', id);
    return await this.cardService.findById(id);
  }

  async findAllCard(data: any) {
    return await this.cardService.findAll(data);
  }
}
