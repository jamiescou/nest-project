/*
 * @Author: chenmy 895849097@qq.com
 * @Date: 2024-06-25 11:21:41
 * @LastEditors: chenmy 895849097@qq.com
 * @LastEditTime: 2025-03-26 10:01:45
 * @FilePath: /nest-blog-main/src/proxy/proxy.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Controller, Post, Query, Get, Body, Headers } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ProxyService } from './proxy.service';
import * as fs from 'fs';

interface ChatMessage {
  model: string;
  stream: boolean;
  messages: { role: string; content: string }[];
}
@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}
  @Post('fetch')
  async makeRequestThroughShadowsocks(@Query('url') url: string) {
    console.log(
      `Received request to fetch ${url} through Shadowsocks proxy...`,
    );

    return this.proxyService.makeRequestThroughShadowsocks(url);
  }
  @Post('/getChatMessage')
  getChatMessage(@Body() body: ChatMessage, @Headers() header) {
    console.log('header==>', body, header);
    return this.proxyService.getChatMessage(body);
  }

  @Get('/setRobotDate')
  @ApiOperation({ summary: '获取机器人定时时间' })
  async setRobotDate(@Query('time') time?: string) {
    console.log('time==>', time);
    // nestjs 读写文件txt
    const data = fs.writeFileSync('./public/robot.txt', time, 'utf-8');
    console.log('data==>', data);
    return {
      time: data,
    };
  }
  @Get('/getRobotDate')
  @ApiOperation({ summary: '获取机器人定时时间' })
  async getRobotDate() {
    const data = fs.readFileSync('./public/robot.txt', 'utf-8');
    return {
      time: data,
    };
  }
}
