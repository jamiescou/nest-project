import { CardInfoDto, CardRo, CreateCardDto } from './dto/card.dto';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CardEntity } from './card.entity';
import fs from 'fs';
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
    qb.orderBy('post.create_time', 'DESC');

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
}
