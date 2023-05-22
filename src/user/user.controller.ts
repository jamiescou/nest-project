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
}
