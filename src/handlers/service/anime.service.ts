import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Anime } from '../../database/entities/AnimeTable.entity';
import { CurrentAnime } from '../../database/entities/CurrentAnimeTable.entity';
import { PastAnime } from '../../database/entities/PastAnimeTable.entity';
import { ViewedAnime } from 'src/database/entities/ViewedAnimeTable.entity';

@Injectable()
export class AnimeService {
  constructor(
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
    @InjectRepository(CurrentAnime)
    private readonly currentAnimeRepository: Repository<CurrentAnime>,
    @InjectRepository(PastAnime)
    private readonly pastAnimeRepository: Repository<PastAnime>,
    @InjectRepository(ViewedAnime)
    private readonly viedAnimeRepository:Repository<ViewedAnime>
  ) {}

  async registerAnime(animeData: any, user: any) {
    try {

      const existsanime = await this.animeRepository.
      findOne({ where: { anime_name: animeData.animeName ,user: { user_id: user.user_id }   } });
      if (existsanime) {
        throw new BadRequestException('既にそのアニメは登録されています');
      }

      const anime = this.animeRepository.create({
        user: user.userId,
        anime_name: animeData.animeName,
        episode: 1,
        favoriteCharacter: animeData.favoriteCharacter,
        speed: animeData.speed,
        iswatched:false,
      });

      await this.animeRepository.save(anime);

      if(animeData.seasonType == "1"){
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
        await this.currentAnimeRepository.save(current);
      }else{
        const jstDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" });
        const dateInJST = new Date(jstDate);
        const past = this.pastAnimeRepository.create({
          anime:anime,
          user_id: user.userId,
          watching_start_date:dateInJST
        });
        await this.pastAnimeRepository.save(past);
      }

      return {
        success: true,
        message: 'アニメが登録されました',
      };
    }catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else if (error instanceof TypeError) {
        throw new BadRequestException('リクエストデータに問題があります');
      } else {
        console.error('予期しないエラー:', error);
        throw new BadRequestException('サーバーでエラーが発生しました');
      }
    }
  }

  async extractSeasonAndYear(releaseDate: string) {
    const date = new Date(releaseDate);
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    
    let season: string;
  
    if (month >= 1 && month <= 3) {
      season = '冬';
    } else if (month >= 4 && month <= 6) {
      season = '春';
    } else if (month >= 7 && month <= 9) {
      season = '夏';
    } else {
      season = '秋';
    }
  
    return { year, season};
  }

  async searchCurrentList(user: any){
    try {
      const currentAnimeData = await this.currentAnimeRepository
      .createQueryBuilder('current_anime')
      .select([
        'current_anime.year AS year',
        'current_anime.season AS season',
        'current_anime.releaseDate AS releasedate',
        'current_anime.delivery_weekday AS delivery_weekday',
        'current_anime.delivery_time AS delivery_time',
        'anime.anime_id AS anime_id',
        'anime.user_id AS user_id',
        'anime.anime_name AS anime_name',
        'anime.episode AS episode',
        'anime.favoriteCharacter AS favoriteCharacter',
        'anime.speed AS speed',
        'anime.iswatched AS iswatched'
      ])
      .innerJoin('current_anime.anime', 'anime') 
      .where('current_anime.user_id = :userId AND anime.iswatched = :status', { userId: user.userId, status: false })
      .orderBy({
        'current_anime.delivery_weekday': 'ASC',
        'current_anime.delivery_time': 'ASC',
        'anime.anime_id': 'ASC'
      })
      .getRawMany();
      return {
        success: true,
        data:currentAnimeData,
        message: 'アニメが取得されました',
      };
    } catch (error) {
      console.error('アニメデータの取得エラー:', error);
      return {
        success: false,
        message: 'アニメの取得に失敗しました',
        error: error.message,
      };
    }
  }

  async currentAnimeEpisodeUp(animeId: number, user: any){
    try {
      const currentAnime = await this.animeRepository.findOne({
        where: {
          anime_id: animeId,
          user: { user_id: user.user_id },
        },
        relations: ['user'],
      });

    if (!currentAnime) {
      return {
        success: false,
        message: '対象のアニメが見つかりませんでした',
      };
    }

    currentAnime.episode += 1;

    await this.animeRepository.save(currentAnime);
    return {
      success: true,
    };
    }catch (error) {
      console.error('話数カウントアップエラー:', error);
      return {
        success: false,
        message: '話数のカウントアップに失敗しました',
        error: error.message,
      };
    }
  }

  async currentAnimeFinishWatching(animeId: number, user: any){
    try {
      const currentAnime = await this.animeRepository.findOne({
        where: {
          anime_id: animeId,
          user: { user_id: user.user_id },
        },
        relations: ['user'],
      });

    if (!currentAnime) {
      return {
        success: false,
        message: '対象のアニメが見つかりませんでした',
      };
    }

    currentAnime.iswatched = true;

    await this.animeRepository.save(currentAnime);

    const jstDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" });
    const dateInJST = new Date(jstDate);

    const viedAnime = this.viedAnimeRepository.create({
      anime:currentAnime,
      user_id: user.userId,
      viewed_end_date:dateInJST
    });

    await this.viedAnimeRepository.save(viedAnime);
    return {
      success: true,
    };
    }catch (error) {
      console.error('話数カウントアップエラー:', error);
      return {
        success: false,
        message: '話数のカウントアップに失敗しました',
        error: error.message,
      };
    }
  }

  async searchPastList(user: any){
    try {
      const pastAnimeData = await this.pastAnimeRepository
      .createQueryBuilder('past_anime')
      .select([
        'past_anime.watching_start_date AS watching_start_date',
        'anime.anime_id AS anime_id',
        'anime.user_id AS user_id',
        'anime.anime_name AS anime_name',
        'anime.episode AS episode',
        'anime.favoriteCharacter AS favoriteCharacter',
        'anime.speed AS speed',
        'anime.iswatched AS iswatched'
      ])
      .innerJoin('past_anime.anime', 'anime') 
      .where('past_anime.user_id = :userId AND anime.iswatched = :status', { userId: user.userId, status: false })
      .orderBy({
        'past_anime.watching_start_date': 'ASC'
      })
      .getRawMany();
      return {
        success: true,
        data:pastAnimeData,
        message: 'アニメが取得されました',
      };
    } catch (error) {
      console.error('アニメデータの取得エラー:', error);
      return {
        success: false,
        message: 'アニメの取得に失敗しました',
        error: error.message,
      };
    }
  }

  async pastAnimeEpisodeUp(animeId: number, user: any){
    try {
      const pastAnime = await this.animeRepository.findOne({
        where: {
          anime_id: animeId,
          user: { user_id: user.user_id },
        },
        relations: ['user'],
      });

    if (!pastAnime) {
      return {
        success: false,
        message: '対象のアニメが見つかりませんでした',
      };
    }

    pastAnime.episode += 1;

    await this.animeRepository.save(pastAnime);
    return {
      success: true,
    };
    }catch (error) {
      console.error('話数カウントアップエラー:', error);
      return {
        success: false,
        message: '話数のカウントアップに失敗しました',
        error: error.message,
      };
    }
  }

  async pastAnimeFinishWatching(animeId: number, user: any){
    try {
      const pastAnime = await this.animeRepository.findOne({
        where: {
          anime_id: animeId,
          user: { user_id: user.user_id },
        },
        relations: ['user'],
      });

    if (!pastAnime) {
      return {
        success: false,
        message: '対象のアニメが見つかりませんでした',
      };
    }

    pastAnime.iswatched = true;

    await this.animeRepository.save(pastAnime);

    const jstDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" });
    const dateInJST = new Date(jstDate);

    const viewedAnime = this.viedAnimeRepository.create({
      anime:pastAnime,
      user_id: user.userId,
      viewed_end_date:dateInJST
    });

    await this.viedAnimeRepository.save(viewedAnime);
    return {
      success: true,
    };
    }catch (error) {
      console.error('視聴完了エラー:', error);
      return {
        success: false,
        message: '視聴完了エラーに失敗しました',
        error: error.message,
      };
    }
  }

  async searchviewedList(user: any){
    try {
      const viewedAnimeData = await this.viedAnimeRepository
      .createQueryBuilder('viewed_anime')
      .select([
        'viewed_anime.viewed_end_date AS viewed_end_date',
        'anime.anime_id AS anime_id',
        'anime.user_id AS user_id',
        'anime.anime_name AS anime_name',
        'anime.episode AS episode',
        'anime.favoriteCharacter AS favoriteCharacter',
        'anime.speed AS speed',
        'anime.iswatched AS iswatched'
      ])
      .innerJoin('viewed_anime.anime', 'anime') 
      .where('viewed_anime.user_id = :userId AND anime.iswatched = :status', { userId: user.userId, status: true })
      .orderBy({
        'viewed_anime.viewed_end_date': 'ASC'
      })
      .getRawMany();
      return {
        success: true,
        data:viewedAnimeData,
        message: 'アニメが取得されました',
      };
    } catch (error) {
      console.error('アニメデータの取得エラー:', error);
      return {
        success: false,
        message: 'アニメの取得に失敗しました',
        error: error.message,
      };
    }
  }

  async viewedAgainAnime(animeId: number,user: any){
    try {
      const viewedAnime = await this.animeRepository.findOne({
        where: {
          anime_id: animeId,
          user: { user_id: user.user_id },
        },
        relations: ['user'],
      });

    if (!viewedAnime) {
      return {
        success: false,
        message: '対象のアニメが見つかりませんでした',
      };
    }
    viewedAnime.iswatched = false;
    viewedAnime.episode = 1;
    await this.animeRepository.save(viewedAnime);

    const jstDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" });
    const dateInJST = new Date(jstDate);

    const pastAnime = this.pastAnimeRepository.create({
      anime:viewedAnime,
      user_id: user.userId,
      watching_start_date:dateInJST
    });

    await this.pastAnimeRepository.save(pastAnime);
    return {
      success: true,
    };
    }catch (error) {
      console.error('再視聴エラー:', error);
      return {
        success: false,
        message: '視聴完了に失敗しました',
        error: error.message,
      };
    }
  }
}
