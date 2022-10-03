import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class WechatLoginDto {
  @ApiProperty({ description: '授权码' })
  @IsNotEmpty({ message: '请输入授权码' })
  code: string;
}
export class WxUserInfo {
  @ApiProperty({ description: '授权码' })
  @IsNotEmpty({ message: '请输入授权码' })
  code: string;
  @ApiProperty({ description: 'openid' })
  openid: string;
  @ApiProperty({ description: 'nickname' })
  nickname: string;
  @ApiProperty({ description: 'sex' })
  sex: number;
  @ApiProperty({ description: 'language' })
  language: string;
  @ApiProperty({ description: 'city' })
  city: string;
  @ApiProperty({ description: 'province' })
  province: string;
  @ApiProperty({ description: 'country' })
  country: string;
  @ApiProperty({ description: 'headimgurl' })
  headimgurl: string;
  @ApiProperty({ description: 'privilege' })
  privilege: string[];
  @ApiProperty({ description: 'unionid' })
  unionid: string;
}
