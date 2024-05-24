import { User } from 'src/user/entities/user.entity';
import { DrawRecordRo, DrawRecordInfoDto } from '../dto/create-draw.dto';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('draw')
export class DrawEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 绘画关键字
  @Column()
  prompt: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User | any;
  // // 当前操作人
  // @Column()
  // userid: string;
  // 用户canvas画的图
  // @Column({ type: 'mediumtext', default: null })
  // userId: string;

  @Column({ type: 'mediumtext', default: null })
  canvasurl: string;

  // 生成图片url
  @Column({ type: 'mediumtext', default: null })
  picurl: string;

  // 操作类型
  @Column({ type: 'int', default: 1 })
  type: number; // 1:绘画  2: 下载

  @CreateDateColumn({
    type: 'timestamp',
    comment: '创建时间',
    name: 'create_time',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '更新时间',
    name: 'update_time',
  })
  updateTime: Date;
  toResponseObject(): DrawRecordInfoDto {
    const responseObj: any = {
      ...this,
    };
    responseObj.username = '';
    responseObj.userId = '';
    responseObj.openid = '';
    responseObj.role = 'visitor';
    if (this.user && this.user.id) {
      responseObj.username = this.user.nickname || this.user.username;
      responseObj.userId = this.user.id;
      responseObj.openid = this.user.openid;
      responseObj.role = this.user.role;
      delete responseObj.user;
    }
    delete responseObj.user;
    return responseObj;
  }
}
