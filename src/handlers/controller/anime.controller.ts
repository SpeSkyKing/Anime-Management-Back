import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AnimeService } from '../service/anime.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async registerAnime(
    @Body() animeData: { title: string; speed: string; seasonType: string },
    @Request() req: any,
  ) {
    return this.animeService.registerAnime(animeData, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('current/list')
  async searchCurrentList(
    @Request() req: any,
  ) {
    return this.animeService.searchCurrentList(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('current/episodeUp')
  async currentAnimeEpisodeUp(
    @Request() req: any,
    @Body('animeId') animeId: number,
  ) {
    return this.animeService.currentAnimeEpisodeUp(animeId,req.user);
  }
}
