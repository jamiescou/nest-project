import { Controller, Get, Render, Param, Inject, Query } from '@nestjs/common';
import { PagesService } from './pages.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
@Controller('pages')
export class pagesController {
  constructor(private readonly pagesService: PagesService) {}
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
  // @Get('pc/user')
  // @ApiOperation({ summary: 'PC端详情页' })
  // @Render('pc/detail')
  // async pcPageUser(@Query() query, @Query('userid') userid: string) {
  //   const user = await this.pagesService.findOneUser(userid, query);
  //   console.log('useruseruser==>>', user);
  //   return {
  //     name: 'PC端用户详情页',
  //     type: 'user',
  //     pageInfo: user,
  //   };
  // }
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
