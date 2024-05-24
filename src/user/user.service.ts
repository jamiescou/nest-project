import { compareSync } from 'bcryptjs';
import axios, { AxiosResponse } from 'axios';
axios.defaults.withCredentials = true;
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
  async signIn({ session, applyTime }) {
    console.log('session', session, applyTime);
    try {
      const result = await axios({
        method: 'post',
        url: 'https://burn.hair/api/user/check_in?turnstile=0.J1uQmYkJ4dDPMU5fMPIhmSmGfU-0VwJJw7Mt6vJDZdksM_gsLSuDSsQ8CzWKPCxvKiiZFU7s8K5CCy-8HfbmaE0lMpBcdDZsoOCEAVVwETKRqXrlRPcxBMZq4B2P4_U7qBgXdb6spvXCtSXLMS0F_Ncg_i6JqhkExr2XPC_YCqPzSkrrAKjrqTCVJm-HOfOG5sKTJow7L4UcOCxRQPEUi2Q_DjJCtLsGQ-FvLEZErO0qpGoUeZo_JGTd5wnkWUbv7iQhIzyusnvVRc1Azjk_ncB0ZPg46l2P9y5QR6kZXrYwtenpBLEODtqwVGUqJJTFprTJZtHkNRyxVTYiJdrKi8TGKrERZwpoU4AxX-RaCE3k0LwiG4hLAPNT69HNz15VRp7uaYzE0BgRhfyIcBu-pQMoa08w_KOjodxtVx_I55c.f5klz9sqh-XEbEuMyy2NfQ.72b3b7a39a587a1a4d7ec207fee50fa7d96e2617dbb96742c1aae85d981cd969',
        // 0.J1uQmYkJ4dDPMU5fMPIhmSmGfU-0VwJJw7Mt6vJDZdksM_gsLSuDSsQ8CzWKPCxvKiiZFU7s8K5CCy-8HfbmaE0lMpBcdDZsoOCEAVVwETKRqXrlRPcxBMZq4B2P4_U7qBgXdb6spvXCtSXLMS0F_Ncg_i6JqhkExr2XPC_YCqPzSkrrAKjrqTCVJm-HOfOG5sKTJow7L4UcOCxRQPEUi2Q_DjJCtLsGQ-FvLEZErO0qpGoUeZo_JGTd5wnkWUbv7iQhIzyusnvVRc1Azjk_ncB0ZPg46l2P9y5QR6kZXrYwtenpBLEODtqwVGUqJJTFprTJZtHkNRyxVTYiJdrKi8TGKrERZwpoU4AxX-RaCE3k0LwiG4hLAPNT69HNz15VRp7uaYzE0BgRhfyIcBu-pQMoa08w_KOjodxtVx_I55c.f5klz9sqh-XEbEuMyy2NfQ.72b3b7a39a587a1a4d7ec207fee50fa7d96e2617dbb96742c1aae85d981cd969',
        headers: {
          Cookie: 'session=' + session,
        },
      });
      console.log('===', result);
      return { ...result, applyTime };
    } catch (error) {
      console.log('errror========', error.response.data);
      return { ...error.response.data, applyTime };
    }
  }

  comparePassword(password, libPassword) {
    return compareSync(password, libPassword);
  }
}
