/*
 * @Descripttion:
 * @version:
 * @Author: koala
 * @Date: 2021-12-11 15:48:24
 * @LastEditors: koala
 * @LastEditTime: 2022-01-21 10:50:48
 */
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NewsService } from './news.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateNewsDto, NewsRo } from './dto/news.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/role.guard';

@ApiTags('新闻')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  /**
   * 创建新闻
   */
  @ApiOperation({ summary: '创建新闻' })
  @ApiBearerAuth()
  @Post()
  @Roles('admin', 'root')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async create(@Body() post: CreateNewsDto, @Req() req) {
    return await this.newsService.create(req.user, post);
  }

  /**
   * 获取所有新闻
   */
  @ApiOperation({ summary: '获取新闻列表' })
  @Get('/list')
  async findAll(
    @Query() query,
    @Query('pageSize') pageSize: number,
    @Query('pageNum') pageNum: number,
  ): Promise<NewsRo> {
    return await this.newsService.findAll(query);
  }
  /**
   * 获取归档列表
   */
  @ApiOperation({ summary: '归档日期列表' })
  @Get('/archives')
  getArchives() {
    return this.newsService.getArchives();
  }

  /**
   * 获取新闻归档
   */
  @ApiOperation({ summary: '新闻归档' })
  @Get('/archives/list')
  getArchiveList(@Query('time') time: string) {
    return this.newsService.getArchiveList(time);
  }

  /**
   * 获取指定新闻
   * @param id
   */
  @ApiOperation({ summary: '获取指定新闻' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.newsService.findById(id);
  }

  /**
   * 更新新闻
   * @param id
   * @param post
   */
  @ApiOperation({ summary: '更新指定新闻' })
  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: number, @Body() post: CreateNewsDto) {
    return await this.newsService.updateById(id, post);
  }

  /**
   * 删除
   * @param id
   */
  @ApiOperation({ summary: '删除新闻' })
  @Delete(':id')
  async remove(@Param('id') id) {
    return await this.newsService.remove(id);
  }
}
