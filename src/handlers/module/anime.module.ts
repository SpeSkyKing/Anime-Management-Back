import { Module } from '@nestjs/common';
import { AnimeController } from '../controller/anime.controller';
import { AnimeService } from '../service/anime.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anime } from 'src/database/entities/AnimeTable.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Anime]),
  ],
  controllers: [AnimeController],
  providers: [AnimeService],
})
export class AnimeModule {}
