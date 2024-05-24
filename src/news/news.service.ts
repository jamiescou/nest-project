import { CreateNewsDto, NewsInfoDto, NewsRo } from './dto/news.dto';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { NewsEntity } from './news.entity';
import { count } from 'console';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newssRepository: Repository<NewsEntity>,
  ) {}

  async create(user, news: CreateNewsDto): Promise<number> {
    const { title } = news;
    if (!title) {
      throw new HttpException('缺少新闻标题', HttpStatus.BAD_REQUEST);
    }

    const doc = await this.newssRepository.findOne({
      where: { title },
    });
    if (doc) {
      throw new HttpException('新闻已存在', HttpStatus.BAD_REQUEST);
    }

    // const { tag, category = 0, status, isRecommend, coverUrl } = news;

    // const categoryDoc = await this.categoryService.findById(category);

    // const tags = await this.tagService.findByIds(('' + tag).split(','));
    const newsParam: Partial<NewsEntity> = {
      ...news,
      author: user,
    };
    // if (status === 'publish') {
    //   Object.assign(newsParam, {
    //     publishTime: new Date(),
    //   });
    // }

    const newNews: NewsEntity = await this.newssRepository.create({
      ...newsParam,
    });
    const created = await this.newssRepository.save(newNews);
    return created.id;
  }

  async findAll(query): Promise<NewsRo> {
    const qb = await this.newssRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.author', 'user')
      .orderBy('news.updateTime', 'DESC');
    // qb.where('1 = 1');
    qb.orderBy('news.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const news = await qb.getMany();
    console.log('news==>>', this);
    const result: NewsInfoDto[] = news.map((item) => item.toResponseObject());
    return { list: result, count: count };

    //  使用find 方式实现
    /**
     const { pageNum = 1, pageSize = 10, ...params } = query;
    const result = await this.newssRepository.findAndCount({
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
    const qb = this.newssRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.author', 'user')
      .where('news.id=:id')
      .setParameter('id', id);

    const result = await qb.getOne();
    if (!result)
      throw new HttpException(`id为${id}的新闻不存在`, HttpStatus.BAD_REQUEST);
    // await this.newssRepository.update(id, { count: result.count + 1 });

    return result.toResponseObject();
  }

  async updateById(id, news): Promise<number> {
    const existNews = await this.newssRepository.findOne(id);
    if (!existNews) {
      throw new HttpException(`id为${id}的新闻不存在`, HttpStatus.BAD_REQUEST);
    }

    const { status } = news;
    const newNews = {
      ...news,
      publishTime: status === 'publish' ? new Date() : existNews.publishTime,
    };

    const updateNews = this.newssRepository.merge(existNews, newNews);
    return (await this.newssRepository.save(updateNews)).id;
  }

  async updateViewById(id) {
    const news = await this.newssRepository.findOne(id);
    // const updateNews = await this.newssRepository.merge(news, {
    //   count: news.count + 1,
    // });
    this.newssRepository.save(news);
  }

  async getArchives() {
    const data = await this.newssRepository
      .createQueryBuilder('news')
      .select([`DATE_FORMAT(update_time, '%Y年%m') time`, `COUNT(*) count`])
      .where('status=:status', { status: 'publish' })
      .groupBy('time')
      .orderBy('update_time', 'DESC')
      .getRawMany();
    return data;
  }

  async getArchiveList(time) {
    const data = await this.newssRepository
      .createQueryBuilder('news')
      .where('status=:status', { status: 'publish' })
      .andWhere(`DATE_FORMAT(update_time, '%Y年%m')=:time`, { time: time })
      .orderBy('update_time', 'DESC')
      .getRawMany();
    return data;
  }

  async remove(id) {
    const existNews = await this.newssRepository.findOne(id);
    if (!existNews) {
      throw new HttpException(`id为${id}的新闻不存在`, HttpStatus.BAD_REQUEST);
    }
    return await this.newssRepository.remove(existNews);
  }
}
