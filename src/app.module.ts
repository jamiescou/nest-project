import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import envConfig from '../config/env';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { PagesModule } from './pages/pages.module';
import { TagModule } from './tag/tag.module';
import { DrawModule } from './draw/draw.module';
import { NewsModule } from './news/news.module';
import { CardModule } from './card/card.module';
import { ProxyService } from './proxy/proxy.service';
import { ProxyController } from './proxy/proxy.controller';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [envConfig.path] }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log('configService', envConfig, configService.get('DB_HOST'));
        return {
          type: 'mysql',
          host: configService.get('DB_HOST', '47.116.77.217'),
          // host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 3306),
          username: configService.get('DB_USER', 'root'),
          password: configService.get('DB_PASSWORD', 'Xtaier123!'),
          // password: configService.get('DB_PASSWORD', 'Zou895849097!'),
          database: configService.get('DB_DATABASE', 'nestblog'),
          // database: configService.get('DB_DATABASE', 'drawtab'),

          // charset: 'utf8mb4',
          timezone: '+08:00',
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),
    PostsModule,
    UserModule,
    AuthModule,
    CategoryModule,
    TagModule,
    DrawModule,
    PagesModule,
    NewsModule,
    CardModule,
  ],
  controllers: [AppController, ProxyController],
  providers: [AppService, ProxyService],
})
export class AppModule {}
