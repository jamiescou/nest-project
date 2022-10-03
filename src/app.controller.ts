import {
  Controller,
  Get,
  Post,
  Put,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';

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
@ApiTags('公共接口')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile('file') file: any): Promise<any> {
    console.log('filefilefile==>>>', file);
    // const fileSuffixs = path.extname(file.originalname);
    // console.log('fileSuffixs==>>', fileSuffixs);
    const fileSuffixStr = file.originalname.split('.');
    const fileSuffix = fileSuffixStr[fileSuffixStr.length - 1];
    const fileName = file.originalname.substr(
      0,
      file.originalname.indexOf(fileSuffix) - 1,
    );
    console.log('fileName11==>', file.originalname);
    const size = (file.size / 1024 / 1024).toFixed(3); // 文件大小多少M
    return this.appService.upload(file, { fileName, size, fileSuffix });
  }
}
