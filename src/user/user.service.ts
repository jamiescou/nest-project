import { compareSync } from 'bcryptjs';
import { User } from './entities/user.entity';
import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListRo } from './dto/user-info.dto';
import { Repository } from 'typeorm';
import { WechatUserInfo } from '../auth/auth.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 账号密码注册
   * @param createUser
   */
  async register(createUser: CreateUserDto) {
    const { username } = createUser;

    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (user) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.userRepository.create(createUser);
    return await this.userRepository.save(newUser);
  }

  async registerByWechat(userInfo: WechatUserInfo) {
    const { nickName, openid, avatarUrl, username } = userInfo;
    const newUser = await this.userRepository.create({
      username,
      openid,
      password: 'abc12345', // 默认密码
      nickname: nickName,
      avatar: avatarUrl,
    });
    return await this.userRepository.save(newUser);
  }

  //   async login(user: Partial<CreateUserDto>) {
  //     const { username, password } = user;

  //     const existUser = await this.userRepository
  //       .createQueryBuilder('user')
  //       .addSelect('user.password')
  //       .where('user.username=:username', { username })
  //       .getOne();

  //     console.log('existUser', existUser);
  //     if (
  //       !existUser ||
  //       !(await this.comparePassword(password, existUser.password))
  //     ) {
  //       throw new BadRequestException('用户名或者密码错误');
  //     }
  //     return existUser;
  //   }

  async getUserList(query): Promise<UserListRo> {
    const qb = await this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.updateTime', 'DESC');
    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));
    const records = await qb.getMany();
    return { list: records, count: count };
  }

  async findOne(id: string) {
    return await this.userRepository.find({
      where: { id: id },
    });
  }

  async findByOpenid(openid: string) {
    return await this.userRepository.findOne({ where: { openid } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existUser = await this.userRepository.findOne(id);
    const updateUser = this.userRepository.merge(existUser, updateUserDto);
    return (await this.userRepository.save(updateUser)).id;
  }

  async remove(id: string) {
    const existUser = await this.userRepository.findOne(id);
    if (!existUser) {
      throw new HttpException(`id为${id}的用户不存在`, HttpStatus.BAD_REQUEST);
    }
    return await this.userRepository.remove(existUser);
  }

  comparePassword(password, libPassword) {
    return compareSync(password, libPassword);
  }
}
