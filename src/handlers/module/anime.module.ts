import { Module } from '@nestjs/common';
import { AnimeController } from '../controller/anime.controller';
import { AnimeService } from '../service/anime.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anime } from 'src/database/entities/AnimeTable.entity';
import { PastAnime } from '../../database/entities/PastAnimeTable.entity';
import { CurrentAnime } from '../../database/entities/CurrentAnimeTable.entity';
import { ViewedAnime } from 'src/database/entities/ViewedAnimeTable.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Anime, PastAnime, CurrentAnime,ViewedAnime]),
  ],
  controllers: [AnimeController],
  providers: [AnimeService],
})
export class AnimeModule {}
