import { DrawService } from './draw.service';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Headers,
  Query,
  UseInterceptors,
  UploadedFile,
  StreamableFile,
  UseGuards,
  Res,
} from '@nestjs/common';
import * as fs from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { Response } from 'express'; // 确保从 express 导入
import { CreateDrawDto, DrawRecordRo } from './dto/create-draw.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';

// import { CreateTagDto } from './dto/create-tag.dto';
export const ApiFile =
  (fileName = 'file'): MethodDecorator =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
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
  @ApiOperation({ summary: '去掉水印接口' })
  @ApiBearerAuth()
  @Post('/removeWatermark')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(FileInterceptor('file'))
  async removeWatermark(
    @Query('type') type: string,
    @UploadedFile('file') file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      console.log('Received file:', file, type);
      const imageBuffer = await this.drawService.removeWatermark(file, type);
      console.log('Processed image buffer type:', typeof imageBuffer);
      console.log('Processed image buffer length:', imageBuffer.length);

      const tempDir = join(__dirname, 'temp');
      const filePath = join(tempDir, file.originalname);
      console.log('Temporary file path:', filePath);

      await mkdir(tempDir, { recursive: true });
      console.log('Temporary directory ensured');

      await fs.promises.writeFile(filePath, imageBuffer, 'binary');
      console.log('File written to temporary path');

      try {
        await fs.promises.access(filePath);
        console.log('File exists after writing');
      } catch (accessError) {
        console.error('File does not exist after writing:', accessError);
        throw accessError;
      }
      const fileStream = fs.createReadStream(filePath);
      fileStream.on('error', (error) => {
        console.error('Error reading file:', error);
        res.status(500).send('Error reading file');
      });
      res.set({
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="${file.originalname}"`,
      });

      console.log('Starting to pipe file stream to response');
      fileStream.pipe(res);
    } catch (err) {
      console.error('Error in removeWatermark:', err);
      res.status(500).send('Error removing watermark');
    }
  }
}
