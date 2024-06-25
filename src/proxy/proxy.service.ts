/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, HttpService } from '@nestjs/common';
import axios from 'axios';
// import * as yaml from 'js-yaml';
const { SocksProxyAgent } = require('socks-proxy-agent');
@Injectable()
export class ProxyService {
  private readonly httpService: HttpService;
  constructor() {
    this.httpService = new HttpService();
  }
  async makeRequestThroughShadowsocks(url: string) {
    try {
      console.log('Starting Shadowsocks client...');
      const proxyUrl = `socks5://127.0.0.1:7890`;
      const agent = new SocksProxyAgent(proxyUrl);

      console.log(
        `Making request to ${url} through Shadowsocks proxy at ${proxyUrl}...`,
      );

      const response = await axios.post(url, {
        httpAgent: agent,
        httpsAgent: agent,
        timeout: 10000, // 设置超时为10秒
      });
      console.log('Request successful:', response.data);
      return response.data;
    } catch (error) {
      console.error(
        'Failed to make request through Shadowsocks:',
        error.message,
      );
      throw new Error(
        `Failed to make request through Shadowsocks: ${error.message}`,
      );
    }
  }
}
