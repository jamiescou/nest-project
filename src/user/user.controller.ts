import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Request,
  Req,
  Query,
} from '@nestjs/common';
import * as fs from 'fs';
const moment = require('moment');
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserInfoDto } from './dto/user-info.dto';
import { AuthGuard } from '@nestjs/passport';
import { query } from 'express';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({ status: 201, type: UserInfoDto })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  register(@Body() createUser: CreateUserDto) {
    console.log('createUser==>', createUser);
    return this.userService.register(createUser);
  }

  // @ApiOperation({ summary: '获取用户信息' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  // @Get()
  // async getUserInfo(@Req() req) {
  //   return req.user;
  // }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/userInfo/:id')
  findOne(@Param('id') id: string) {
    console.log(222);
    return this.userService.findOne(id);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('/userInfo/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log('ssssss===', id, updateUserDto);
    return this.userService.update(id, updateUserDto);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('/userInfo/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
  @ApiOperation({ summary: '获取所有用户' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/getUserList')
  async getUserList(@Query() query) {
    return this.userService.getUserList(query);
  }
  @ApiTags('头顶冒火签到')
  @Get('/signIn')
  @ApiOperation({ summary: '头顶冒火签到' })
  async userSignIn(@Query('session') session: string) {
    console.log('头顶冒火签到', session);
    const data = fs.readFileSync('public/session.json', 'utf8') || '[]';
    const sessionData = JSON.parse(data);
    const oldLen = sessionData.length;
    sessionData.filter((item: any) => {
      if (session && item.session !== session) {
        sessionData.push({
          session,
          applyTime: moment().format('YYYY-MM-DD hh:mm:ss'),
        });
      }
    });
    const newLen = sessionData.length;
    const res = await this.userService.signIn({
      session: session,
      applyTime: moment().format('YYYY-MM-DD hh:mm:ss'),
    });
    if (!res.message.includes('未登录且未提供') && newLen !== oldLen) {
      if (oldLen === 0) {
        fs.writeFileSync(
          'public/session.json',
          JSON.stringify([
            {
              session: session,
              applyTime: moment().format('YYYY-MM-DD hh:mm:ss'),
            },
          ]),
        );
        return res;
      }
      fs.writeFileSync('public/session.json', JSON.stringify(sessionData));
    }
    return res;
  }
}
