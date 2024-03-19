/*
 * @Descripttion:
 * @version:
 * @Author: koala
 * @Date: 2021-12-11 15:48:24
 * @LastEditors: koala
 * @LastEditTime: 2022-01-21 10:50:48
 */
import * as fs from 'fs';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CardService } from './card.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CreateCardDto, CardRo } from './dto/card.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/role.guard';
import { fstat } from 'fs';

@ApiTags('流量卡')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
  /**
   * 获取所有文章
   */
  @ApiOperation({ summary: '获取流量卡列表' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/list')
  async findAll(
    @Query() query,
    @Query('pageSize') pageSize: number,
    @Query('pageNum') pageNum: number,
  ): Promise<CardRo> {
    return await this.cardService.findAll(query);
  }
  /**
   * 获取指定文章
   * @param id
   */
  @ApiOperation({ summary: '获取指定流量卡' })
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/import')
  async importAllCard(): Promise<boolean> {
    const data = fs.readFileSync('src/card/dto/card.json', 'utf8');
    const cards = JSON.parse(data);
    console.log('cards', cards);
    const results = cards.data.map((item) => {
      return {
        id: item.id,
        productID: item.productID,
        productName: item.productName,
        remark: item.remark,
        mainPic: item.mainPic,
        littlepicture: item.littlepicture,
        userID: item.userID,
        rule: item.rule,
        areaRead: item.areaRead,
        acquireModel: item.acquireModel,
        idCardRepeat: item.idCardRepeat,
        phoneRepeat: item.phoneRepeat,
        firstLevelMoney: item.firstLevelMoney,
        numberSel: item.numberSel,
        backMoneyType: item.backMoneyType,
        age2: item.age2,
        age1: item.age1,
        zhutui: item.zhutui,
        disableArea: item.disableArea,
        area: item.area,
        photoType: item.photoType,
        positionform: item.positionform,
        parentProductID: item.parentProductID,
        operator: item.operator,
        sPriceRead: item.sPriceRead,
        sPrice: item.sPrice,
        commissionType: item.commissionType,
        count: null,
      };
    });
    await this.cardService.importCard(results);
    return true;
  }
}
