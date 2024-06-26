import { UserService } from './../user/user.service';
import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import {
  AccessTokenInfo,
  SessionKeyInfo,
  AccessConfig,
  WechatError,
  WechatUserInfo,
} from './auth.interface';
import { lastValueFrom, map, Observable } from 'rxjs';
import axios, { AxiosResponse } from 'axios';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private httpService: HttpService,
  ) {}
  private accessTokenInfo: AccessTokenInfo;
  private sessionKeyInfo: SessionKeyInfo;
  public apiServer = 'https://api.weixin.qq.com';

  createToken(user: Partial<User>) {
    return this.jwtService.sign(user);
  }

  async login(user: Partial<User>) {
    const token = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      token,
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      role: user.role,
      openid: user.openid || '',
      avatarUrl: user.avatar || '',
    };
  }

  async loginWithWechat(userInfo) {
    console.log('loginWithWechat', userInfo);
    this.accessTokenInfo = null;
    if (!userInfo.code) {
      throw new BadRequestException('请输入微信授权码');
    }
    await this.getAccessToken(userInfo.code);
    const user = await this.getUserByOpenid();
    console.log('loginWithWechat', user);
    if (!user) {
      // 获取用户信息，注册新用户
      await this.userService.registerByWechat({
        ...userInfo,
        username: userInfo.nickName,
        openid: this.accessTokenInfo.openid,
      });
      const userNew = await this.getUserByOpenid();
      return this.login(userNew);
    }
    return this.login(user);
  }

  async getUser(user) {
    return await this.userService.findOne(user.id);
  }

  async getUserByOpenid() {
    return await this.userService.findByOpenid(this.accessTokenInfo.openid);
  }
  async getUserInfo() {
    // const result: AxiosResponse<WechatError & WechatUserInfo> =
    //   await lastValueFrom(
    //     this.httpService.get(
    //       `${this.apiServer}/sns/userinfo?access_token=${this.accessTokenInfo.accessToken}&openid=${this.accessTokenInfo.openid}`,
    //     ),
    //   );
    // if (result.data.errcode) {
    //   throw new BadRequestException(
    //     `[getUserInfo] errcode:${result.data.errcode}, errmsg:${result.data.errmsg}`,
    //   );
    // }
    // return result.data;
  }

  async getAccessToken(code) {
    const { APPID, APPSECRET } = process.env;
    const url = `${this.apiServer}/sns/jscode2session?appid=${APPID}&secret=${APPSECRET}&js_code=${code}&grant_type=authorization_code`;
    if (!APPSECRET) {
      throw new BadRequestException('[getAccessToken]必须有appSecret');
    }
    if (
      !this.accessTokenInfo ||
      (this.accessTokenInfo && this.isExpires(this.accessTokenInfo))
    ) {
      const res: AxiosResponse<WechatError & AccessConfig, any> =
        await axios.get(url);
      if (res.data.errcode) {
        throw new BadRequestException(
          `[getAccessToken] errcode:${res.data.errcode}, errmsg:${res.data.errmsg}`,
        );
      }
      console.log('getAccessToken', res.data);
      this.accessTokenInfo = {
        sessionKey: res.data.session_key,
        expiresIn: res.data.expires_in,
        getTime: Date.now(),
        openid: res.data.openid,
      };
    }

    return this.accessTokenInfo;
  }

  isExpires(access) {
    return Date.now() - access.getTime > access.expiresIn * 1000;
  }
}
