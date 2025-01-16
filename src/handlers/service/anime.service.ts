import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anime } from '../../database/entities/AnimeTable.entity';

@Injectable()
export class AnimeService {
  constructor(
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
  ) {}

  async registerAnime(animeData: any, user: any) {
    try {
      console.log('登録アニメ:', animeData);
      console.log('登録ユーザー:', user);

      const anime = this.animeRepository.create({
        user: user.userId,
        anime_name: animeData.title,
        episode: 1,
        favoriteCharacter: animeData.favoriteCharacter,
        speed: animeData.speed,
      });

      await this.animeRepository.save(anime);

      return {
        success: true,
        message: 'アニメが登録されました',
      };
    } catch (error) {
      console.error('アニメデータの登録エラー:', error);
      return {
        success: false,
        message: 'アニメの登録に失敗しました',
        error: error.message,
      };
    }
  }
}
