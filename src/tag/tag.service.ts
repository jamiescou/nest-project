import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async create(name) {
    return await this.tagRepository.save({ name });
  }

  async findAllTags() {
    const qb = await this.tagRepository.createQueryBuilder('tag');
    return await qb.getMany();
  }
  async findByIds(ids: string[]) {
    return this.tagRepository.findByIds(ids);
  }
}
