import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { NewsInfoDto } from './dto/news.dto';

@Entity('news')
export class NewsEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主列，值自动生成

  // 文章标题
  @Column({ length: 50 })
  title: string;
  //   // 用户id
  //   @Column({ length: 50 })
  //   userId: User;
  // markdown内容
  @Column({ type: 'mediumtext', default: null })
  content: string;

  // 摘要，自动生成
  @Column({ type: 'text', default: null })
  summary: string;

  // 作者
  @ManyToOne((type) => User, (user) => user.nickname)
  author: User;

  @Column({ type: 'timestamp', name: 'publish_time', default: null })
  publishTime: Date;

  @Column({
    type: 'timestamp',
    name: 'create_time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    type: 'timestamp',
    name: 'update_time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;
  toResponseObject(): NewsInfoDto {
    const responseObj: NewsInfoDto = {
      ...this,
    };
    if (this.author && this.author.id) {
      responseObj.author = this.author.nickname || this.author.username;
    }
    return responseObj;
  }
}
