import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '文章标题必填' })
  readonly title: string;

  @ApiPropertyOptional({ description: '内容' })
  readonly content: string;
}

export class NewsInfoDto {
  public id: number;
  public title: string;
  public content: string;
  public summary: string;
  //   public userId: string;
  public author: any;
}

export interface NewsRo {
  list: NewsInfoDto[];
  count: number;
}
