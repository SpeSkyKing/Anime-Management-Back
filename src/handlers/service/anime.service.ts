import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anime } from '../../database/entities/AnimeTable.entity';
import { CurrentAnime } from '../../database/entities/CurrentAnimeTable.entity';
import { PastAnime } from '../../database/entities/PastAnimeTable.entity';

@Injectable()
export class AnimeService {
  constructor(
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
    @InjectRepository(CurrentAnime)
    private readonly currentAnimeRepository: Repository<CurrentAnime>,
    @InjectRepository(PastAnime)
    private readonly pastAnimeRepository: Repository<PastAnime>
  ) {}

  async registerAnime(animeData: any, user: any) {
    try {
      const anime = this.animeRepository.create({
        user: user.userId,
        anime_name: animeData.animeName,
        episode: 1,
        favoriteCharacter: animeData.favoriteCharacter,
        speed: animeData.speed,
        iswatched:true,
      });

      await this.animeRepository.save(anime);

      if(animeData.seasonType){
        const date = new Date(animeData.ReleaseDate);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        let season: string;
      
        if (month >= 1 && month <= 3) {
          season = "4";
        } else if (month >= 4 && month <= 6) {
          season = "1";
        } else if (month >= 7 && month <= 9) {
          season = "2";
        } else {
          season = "3";
        }
        const current = this.currentAnimeRepository.create({
          user_id: user.userId,
          anime:anime,
          year: year,
          season: season,
          releaseDate: animeData.ReleaseDate,
          delivery_weekday:animeData.deliveryWeekday,
          delivery_time:animeData.deliveryTime
        });
        console.log(current);
        await this.currentAnimeRepository.save(current);
      }else{
        const jstDate = new Date();
        jstDate.setHours(jstDate.getHours() + 9);
        const past = this.pastAnimeRepository.create({
          anime:anime,
          user_id: user.userId,
          watching_start_date:jstDate
        });
        await this.pastAnimeRepository.save(past);
      }

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

  async extractSeasonAndYear(releaseDate: string) {
    const date = new Date(releaseDate); // ReleaseDateをDate型に変換
    const month = date.getMonth() + 1;  // 月を取得 (0月から始まるため +1 する)
    const year = date.getFullYear();    // 年を取得
    
    let season: string;
  
    // 季節を決定
    if (month >= 1 && month <= 3) {
      season = '冬';  // 1~3月 → 冬
    } else if (month >= 4 && month <= 6) {
      season = '春';  // 4~6月 → 春
    } else if (month >= 7 && month <= 9) {
      season = '夏';  // 7~9月 → 夏
    } else {
      season = '秋';  // 10~12月 → 秋
    }
  
    return { year, season};
  }
}
