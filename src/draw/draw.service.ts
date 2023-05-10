import { HttpService } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import fs, { createWriteStream } from 'fs';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { DrawEntity } from './entities/draw.entity';

@Injectable()
export class DrawService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly httpService: HttpService) {} // private readonly drawRepository: Repository<DrawEntity>, // @InjectRepository(DrawEntity)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // constructor() {} // private readonly drawRepository: Repository<DrawEntity>, // @InjectRepository(DrawEntity)
  async predictImage(prompt, image) {
    const params: any = {
      prompt: prompt,
      image: image,
      structure: 'scribble',
    };
    const res = await axios({
      method: 'post',
      url: 'https://scribblediffusion.com/api/predictions',
      data: params,
    });
    return res.data;
  }
  async getPictureById(id) {
    const res = await axios({
      method: 'get',
      url: 'https://scribblediffusion.com/api/predictions/' + id,
    });
    console.log('getPictureById', res.data);
    if (res.data.output && res.data.output.length > 0) {
      console.log('res.data.output==>', res.data.output);
      const downloadRes = await this.download(res.data.output[0]);
      console.log('downloadRes==>', downloadRes);
      res.data.fileUrl =
        'http://oss.chenmychou.cn/storage/download/' + downloadRes;
    }
    return res.data;
  }
  async download(url: string) {
    const fileName =
      moment().format('YYYYMMDDhhmmss') +
      Math.floor(Math.random() * 10000) +
      '.png';
    const writer = createWriteStream(
      path.join(__dirname, '../../../public/download/', fileName),
    );
    const response: any = await this.httpService.axiosRef({
      url,
      method: 'GET',
      responseType: 'stream',
    });
    console.log('response', response);
    response.data.pipe(writer);
    return new Promise((resolve: any, reject: any) => {
      writer.on('finish', resolve(fileName));
      writer.on('error', reject(false));
    });
  }
}
