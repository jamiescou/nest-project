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
import {
  CreateDrawDto,
  DrawRecordRo,
  DrawRecordInfoDto,
} from './dto/create-draw.dto';

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
    const res: any = await axios({
      method: 'get',
      url: 'https://scribblediffusion.com/api/predictions/' + id,
    });
    console.log('getPictureById', res.data);
    if (res.data.output && res.data.output.length > 0) {
      const downloadRes = await this.download(res.data.output[0]);
      res.data.fileUrl =
        'https://oss.chenmychou.cn/storage/download/' + downloadRes;
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
      .where('draw.userId =:userId', {
        userId: userId || '',
      })
      .orderBy('draw.updateTime', 'DESC');
    if (query.type) {
      qb.where('draw.type =:type', {
        type: query.type * 1,
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
