import { HttpService } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import fs, { createWriteStream } from 'fs';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');
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
  ) { }
  changeAiKey(aiKeyId){
    console.log('changeAiKeychangeAiKey', aiKeys, aiKeyId)
    Authorization = `Bearer ${aiKeys.keys[aiKeyId].key}`;
    return {
      keyName: aiKeys.keys[aiKeyId].name,
      label: aiKeys.keys[aiKeyId].label,
    }
  }
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
      console.log('AuthorizationAuthorization', Authorization)
      const downloadRes = await this.download(res.data.data[0].url);
      const result = {
        code: 200,
        msg: '操作成功',
        fileUrl: 'https://oss.chenmychou.cn/storage/download/' + downloadRes,
      };
      return result;
    } catch (error) {
      console.log(error.response.data);
      return {
        msg: '操作失败',
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
}
