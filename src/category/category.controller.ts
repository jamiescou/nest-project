import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('文章分类')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @ApiOperation({ summary: '创建分类' })
  @Post()
  async create(@Body() body: CreateCategoryDto) {
    return await this.categoryService.create(body.name);
  }
  @ApiOperation({ summary: '分类列表' })
  @Get('/list')
  categoryList() {
    return this.categoryService.findAllCategory();
  }
}
