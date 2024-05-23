import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({ description: '流量卡ID' })
  @IsNotEmpty({ message: '流量卡ID不能为空' })
  readonly id: string;
  @ApiPropertyOptional({ description: '流量卡产品id' })
  readonly productID: string;
  @ApiPropertyOptional({ description: '流量卡名称' })
  readonly productName: string;

  @ApiPropertyOptional({ description: '流量卡说明' })
  readonly remark: string;

  @ApiPropertyOptional({ description: '流量卡主图' })
  readonly mainPic: string;

  @ApiProperty({ description: '流量卡小图' })
  readonly littlepicture: string;

  @ApiPropertyOptional({ description: '店家ID' })
  readonly userID: string;

  @ApiPropertyOptional({ description: '流量卡规则' })
  readonly rule: string;

  @ApiPropertyOptional({ description: '归属地' })
  readonly areaRead: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly acquireModel: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly idCardRepeat: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly phoneRepeat: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly firstLevelMoney: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly numberSel: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly backMoneyType: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly age2: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly age1: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly zhutui: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly disableArea: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly area: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly photoType: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly positionform: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly parentProductID: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly operator: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly sPriceRead: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly sPrice: string;
  @ApiPropertyOptional({ description: '归属地' })
  readonly commissionType: string;
}
export class CardInfoDto {
  public id: string;
  public productID: string;
  public productName: string;
  public remark: string;
  public mainPic: string;
  public littlepicture: string;
  public userID: string;
  public rule: string;
  public areaRead: string;
}

export interface CardRo {
  list: CardInfoDto[];
  count: number;
}
