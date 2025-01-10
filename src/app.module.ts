import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: +process.env.POSTGRES_PORT || 5432,
      username: process.env.POSTGRES_USER || 'user',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'anime_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // エンティティファイルの場所を指定
      synchronize: false, // 本番環境ではfalseにする
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
