import { Controller, Post, Query, Res } from '@nestjs/common';
import { ProxyService } from './proxy.service';

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
}
