import { DrawService } from './draw.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Get, Param } from '@nestjs/common';
// import { CreateTagDto } from './dto/create-tag.dto';

@ApiTags('AI画图')
@Controller('draw')
export class DrawController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly drawService: DrawService) {}

  @ApiOperation({ summary: '预测图片' })
  @Post('/predictions')
  create(@Body() body: any) {
    console.log(body);
    const { prompt, image } = body;
    return this.drawService.predictImage(prompt, image);
  }

  @ApiOperation({ summary: '获取对应的图片' })
  @Get('/getPictureById/:id')
  getPictures(@Param('id') id: string) {
    console.log(id);
    return this.drawService.getPictureById(id);
  }
}
// async download(url: string, path: string) {
//   const writer = createWriteStream(path);
//   const response: any = await this.httpService.axiosRef({
//     url,
//     method: 'GET',
//     responseType: 'stream',
//   });
//   response.data.pipe(writer);
//   return new Promise((resolve, reject) => {
//     writer.on('finish', resolve);
//     writer.on('error', reject);
//   });
// }
