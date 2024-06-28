import { HttpService } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import fs, { createWriteStream } from 'fs';
import * as path from 'path';
import * as FormData from 'form-data';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');
/* eslint-disable @typescript-eslint/no-var-requires */
const { SocksProxyAgent } = require('socks-proxy-agent');
import * as Jimp from 'jimp';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DrawEntity } from './entities/draw.entity';
import aiKeys from './data/key';
import {
  CreateDrawDto,
  DrawRecordRo,
  DrawRecordInfoDto,
} from './dto/create-draw.dto';
let Authorization = `Bearer ${aiKeys.keys[0].key}`;

@Injectable()
export class DrawService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // constructor(private readonly httpService: HttpService) {} // private readonly drawRepository: Repository<DrawEntity>, // @InjectRepository(DrawEntity)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    @InjectRepository(DrawEntity)
    private readonly drawRepository: Repository<DrawEntity>,
    private readonly httpService: HttpService,
  ) {}
  changeAiKey(aiKeyId) {
    console.log('changeAiKeychangeAiKey', aiKeys, aiKeyId);
    Authorization = `Bearer ${aiKeys.keys[aiKeyId].key}`;
    return {
      keyName: aiKeys.keys[aiKeyId].name,
      label: aiKeys.keys[aiKeyId].label,
    };
  }
  async processNetworkImage(
    url: string,
    outputFilePath: string,
  ): Promise<void> {
    try {
      const image = await Jimp.read(url);
      const font = await Jimp.loadFont(Jimp.FONT_SANS_8_WHITE);
      console.log('processNetworkImageprocessNetworkImage', image);
      await image
        .resize(300, 300) // 调整图像大小
        .quality(80) // 设置图像质量
        // .print(font, 10, 10, 'sbml') // 在 (10, 10) 位置添加文字
        .writeAsync(outputFilePath); // 保存图像
    } catch (error) {
      console.error('Error processing network image:', error);
      throw error;
    }
  }

  async addWatermark(
    filePath: string,
    outputFilePath: string,
    text: string,
  ): Promise<void> {
    const image = await Jimp.read(filePath);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    await image
      .print(font, 10, 10, text) // 在 (10, 10) 位置添加文字
      .writeAsync(outputFilePath);
  }

  // async saveImage(file: Express.Multer.File): Promise<string> {
  //   const outputFilePath = path.join(__dirname, '..', 'uploads', `compressed-${file.originalname}`);
  //   await this.compressImage(file.path, outputFilePath);
  //   return outputFilePath;
  // }
  async predictImage(prompt, image) {
    const params: any = {
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    };
    try {
      const res: any = await axios({
        method: 'post',
        url: 'https://burn.hair/v1/images/generations',
        data: params,
        headers: {
          Authorization,
        },
      });
      console.log('AuthorizationAuthorization', Authorization);
      // const downloadRes: any = await this.download(res.data.data[0].url);
      const fileName =
        moment().format('YYYYMMDDhhmmss') +
        Math.floor(Math.random() * 10000) +
        '.png';
      const imageData = await this.processNetworkImage(
        res.data.data[0].url,
        path.join(__dirname, '../../../public/download/', fileName),
      );
      const result = {
        code: 200,
        msg: '操作成功',
        originUrl: res.data.data[0].url,
        fileUrl: 'https://oss.chenmychou.cn/storage/download/' + fileName,
      };
      return result;
    } catch (error) {
      console.log(error.response);
      console.log(error.response.data);
      // if (error.response.data.error === 'content_policy_violation') {
      //   return {
      //     code: 400,
      //     msg: '输入内容违规',
      //     data: error.response.data.error,
      //   };
      // }
      return {
        msg: '输入内容违规',
        error: error.response.data.error,
      };
    }
  }
  async getPictureById(url) {
    const downloadRes = await this.download(url);
    return {
      fileUrl: 'https://oss.chenmychou.cn/storage/download/' + downloadRes,
    };
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

  async creatRecord(data: CreateDrawDto) {
    const newRecord: DrawEntity = await this.drawRepository.create(data);
    const created = await this.drawRepository.save(newRecord);
    return created.id;
  }

  async findAll(query): Promise<DrawRecordRo> {
    const qb = await this.drawRepository
      .createQueryBuilder('draw')
      .leftJoinAndSelect('draw.user', 'user')
      .orderBy('draw.updateTime', 'DESC');
    if (query.type && query.userId) {
      qb.where('draw.type =:type and draw.user =:userId', {
        type: query.type,
        userId: query.userId,
      });
    } else if (query.type) {
      qb.where('draw.type =:type', {
        type: query.type * 1,
      });
    } else if (query.userId) {
      qb.where('draw.user =:userId', {
        userId: query.userId,
      });
    } else if (query.startTime && query.endTime) {
      qb.where('draw.create_time BETWEEN :startTime AND :endTime', {
        startTime: query.startTime,
        endTime: query.endTime,
      });
    }
    qb.orderBy('draw.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10 } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const records = await qb.getMany();
    console.log('records==>', records);
    const result: DrawRecordInfoDto[] = records.map((item) =>
      item.toResponseObject(),
    );
    return { list: result, count: count };
  }
  async getRecordList(query, userId): Promise<DrawRecordRo> {
    const qb = await this.drawRepository
      .createQueryBuilder('draw')
      .leftJoinAndSelect('draw.user', 'user')
      .orderBy('draw.updateTime', 'DESC');
    qb.where('draw.userId =:userId', {
      userId: userId,
    });
    if (query.type) {
      qb.where('draw.type =:type AND draw.userId =:userId', {
        type: query.type * 1,
        userId: userId,
      });
    } else if (query.startTime && query.endTime) {
      qb.where('draw.create_time BETWEEN :startTime AND :endTime', {
        startTime: query.startTime,
        endTime: query.endTime,
      });
    }
    console.log('service in draw===>>', query, userId);
    qb.orderBy('draw.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10 } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const records = await qb.getMany();
    const result: DrawRecordInfoDto[] = records.map((item) =>
      item.toResponseObject(),
    );
    return { list: result, count: count };
  }
  async removeWatermark(file: Express.Multer.File, type: string): Promise<any> {
    const proxyUrl = `socks5://127.0.0.1:7891`;
    const agent = new SocksProxyAgent(proxyUrl);
    const formData = new FormData();
    formData.append('original_preview_image', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    formData.append('zoom_factor', '2');
    let proxyParms = {};
    if (type == '1') {
      proxyParms = {
        httpAgent: agent,
        httpsAgent: agent,
      };
    }
    try {
      console.log('removeWatermark==', file, formData, type);
      const url =
        'https://api.dewatermark.ai/api/object_removal/v5/erase_watermark';
      const res: any = await axios.post(url, formData, {
        ...proxyParms,
        timeout: 60000, // 设置超时为60秒
        headers: {
          ...formData.getHeaders(), // 使用 FormData 自动生成的 headers
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpZ25vcmUiLCJwbGF0Zm9ybSI6IndlYiIsImlzX3BybyI6ZmFsc2UsImV4cCI6MTcxOTI4NDI3NX0.mpP9GKtU92vXZXdZx-ATXzptGty9l_mkehMLsEIdO9A',
        },
      });
      console.log('res.data====', res.data);
      const imageBuffer = Buffer.from(res.data.edited_image.image, 'base64');
      console.log('imageBufferimageBuffer', imageBuffer);
      return imageBuffer;
    } catch (err) {
      console.log('======err===', err);
      throw err;
    }
  }
}
