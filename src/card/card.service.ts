import { CardInfoDto, CardRo, CreateCardDto } from './dto/card.dto';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CardEntity } from './card.entity';
import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,
  ) {}
  async importCard(results: CreateCardDto[]): Promise<any> {
    const card = await this.cardRepository.create(results);
    await this.cardRepository.save(card);
    return card;
  }
  async findAll(query): Promise<CardRo> {
    const qb = await this.cardRepository.createQueryBuilder('card_tb');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const posts = await qb.getMany();
    const result: CardInfoDto[] = posts.map((item) => item);
    return { list: result, count: count };

    //  使用find 方式实现
    /**
     const { pageNum = 1, pageSize = 10, ...params } = query;
    const result = await this.postsRepository.findAndCount({
      relations: ['category', 'author', "tags"],
      order: {
        id: 'DESC',
      },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });
    const list = result[0].map((item) => item.toResponseObject());
    return { list, count: result[1] };
     */
  }

  async findById(id): Promise<any> {
    const qb = this.cardRepository
      .createQueryBuilder('card_tb')
      .where('id = :id', { id });

    const result = await qb.getOne();
    // const result = await qb.getMany();
    console.log('result', result);
    if (!result)
      throw new HttpException(
        `id为${id}的流量卡不存在`,
        HttpStatus.BAD_REQUEST,
      );
    // await this.cardRepository.update(id, { count: result.count + 1 });

    return result;
  }
  // 通过axios调取接口数据，并将响应保存为json文件
  async getCardFileResult(): Promise<any> {
    const res = await axios({
      method: 'get',
      url: 'https://172appapi.lot-ml.com/api/Products/Query?TimeType=0&page=1&limit=100',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBZ2VudElEIjoiNDMwMzE4IiwibG9naW5OYW1lIjoi6YK55q2j6ZizIiwiVXNlck5hbWUiOiJ6b3Vib3kiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiI0MzAzMTgiLCJuYmYiOjE3MTA3Mjc2NzUsImV4cCI6MTcxMTMzMjQ3NSwiaXNzIjoiWlNTb2Z0LkRhVGllLlVuaUFwaSIsImF1ZCI6IlpTU29mdC5EYVRpZS5VbmlBcGkifQ.m3yi69goEoY0mj5zA6eQBehkDqUe8CeHGoBJLv6WHBI',
      },
    });
    try {
      fs.writeFileSync('public/files/cardResp.json', JSON.stringify(res.data));
      return true;
    } catch (error) {
      return false;
    }
  }
  // 清空card_tb表数据
  async clearCard(): Promise<any> {
    const qb = this.cardRepository.createQueryBuilder('card_tb');
    const result = await qb.delete().execute();
    return result;
  }
}
