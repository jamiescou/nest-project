import { DrawService } from './draw.service';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Headers,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateDrawDto, DrawRecordRo } from './dto/create-draw.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/role.guard';
// import { CreateTagDto } from './dto/create-tag.dto';

@ApiTags('AI画图')
@Controller('draw')
export class DrawController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly drawService: DrawService) {}

  @ApiOperation({ summary: '预测图片' })
  @ApiBearerAuth()
  @Post('/predictions')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(@Body() body: any) {
    console.log(body);
    const { prompt, image } = body;
    return this.drawService.predictImage(prompt, image);
  }
  @ApiOperation({ summary: '切换key' })
  @Get('/changeAiKey/:id')
  changeAiKey(@Param('id') id: string) {
    return this.drawService.changeAiKey(id);
  }

  @ApiOperation({ summary: '获取对应的图片' })
  @ApiBearerAuth()
  @Get('/getPictureById/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getPictures(@Param('id') id: string) {
    console.log(id);
    return this.drawService.getPictureById(id);
  }

  @ApiOperation({ summary: '绘画写入记录' })
  @ApiBearerAuth()
  @Post('/toRecord')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  creatRecord(@Body() body: CreateDrawDto, @Headers() header) {
    console.log('header==>', header);
    const userId = header.userid;
    const params: CreateDrawDto = {
      user: userId,
      ...body,
    };
    return this.drawService.creatRecord(params);
  }

  @ApiOperation({ summary: '获取所有记录列表' })
  @ApiBearerAuth()
  @Get('/getAllRecords')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getAllRecordList(
    @Query() query,
    @Headers() header,
  ): Promise<DrawRecordRo> {
    return await this.drawService.findAll(query);
  }

  @ApiOperation({ summary: '根据条件获取记录列表' })
  @ApiBearerAuth()
  @Get('/getRecordList')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getRecordList(
    @Query() query,
    @Query('pageSize') pageSize: number,
    @Query('pageNum') pageNum: number,
    @Headers() header,
  ): Promise<DrawRecordRo> {
    const userId = header.userid;
    console.log('header========>', header, query);
    return await this.drawService.getRecordList(query, userId);
  }
}
