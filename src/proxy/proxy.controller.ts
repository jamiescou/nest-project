/*
 * @Author: chenmy 895849097@qq.com
 * @Date: 2024-06-25 11:21:41
 * @LastEditors: chenmy 895849097@qq.com
 * @LastEditTime: 2025-03-04 15:47:05
 * @FilePath: /nest-blog-main/src/proxy/proxy.controller.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Controller, Post, Query, Res, Body, Headers } from '@nestjs/common';
import { ProxyService } from './proxy.service';

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
}
