import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDrawDto {
  @ApiProperty({ description: '创建绘画记录' })
  @IsNotEmpty({ message: '绘画关键字必填' })
  readonly prompt: string;
  @ApiProperty({ description: '当前操作用户' })
  readonly user: string;
  @ApiProperty({ description: '用户草图' })
  canvasurl: string;
  @ApiProperty({ description: 'ai画好的成品' })
  picurl: string;
  @ApiProperty({ description: '当前操作类型' })
  type: number;
}

export class DrawRecordInfoDto {
  public id: number;
  public prompt: string;
  // public user: object;
  // public userId: string;
  public canvasurl: string;
  public picurl: string;
  public type: number;
  public createTime: Date;
}

export interface DrawRecordRo {
  list: DrawRecordInfoDto[];
  count: number;
}
