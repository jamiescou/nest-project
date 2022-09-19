import { Controller, Get, Render } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
@Controller('pages')
export class pagesController {
  @Get()
  @Render('pc/index')
  root() {
    return {
      name: 'pc端页面',
    };
  }
}
