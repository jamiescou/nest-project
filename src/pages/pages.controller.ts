import { Controller, Get, Render, Param, Inject, Query } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CardService } from '../card/card.service';

import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
@Controller('pages')
export class pagesController {
  constructor(
    private readonly pagesService: PagesService,
    private readonly cardService: CardService,
  ) {}
  @ApiTags('PC端页面')
  @Get('pc')
  @ApiOperation({ summary: 'PC端首页' })
  @Render('pc/index')
  async pcPage() {
    // const user = await this.pagesService.findOne(id);
    // console.log('useruseruser==>>', user);
    return {
      name: 'pc端首页页面',
      // pageInfo: user,
    };
  }
  @Get('pc/detail')
  @ApiOperation({ summary: 'PC端详情页' })
  @Render('pc/detail')
  async pcPageList(
    @Query() query,
    @Query('postid') postid?: string,
    @Query('userid') userid?: string,
  ) {
    const post = await this.pagesService.findOneInfo(postid, userid, query);
    console.log('useruseruser==>>', post);
    return {
      name: postid ? 'PC端文章详情页' : 'PC端用户详情页',
      type: postid ? 'post' : 'user',
      pageInfo: post,
    };
  }

  @ApiTags('流量卡页面')
  @Get('pc/admin-card')
  @ApiOperation({ summary: '流量卡页面' })
  @Render('pc/card')
  async cardPage(@Query() query, @Query('id') id?: string) {
    const card = await this.pagesService.findCardInfo(id);
    console.log('cardcardcard==>>', card);
    return {
      name: '流量卡页面',
      card,
    };
  }

  @ApiTags('管理端页面')
  @Get('admin')
  @ApiOperation({ summary: '管理端首页' })
  @Render('admin/index')
  adminPage() {
    return {
      name: '管理端页面',
    };
  }
}
