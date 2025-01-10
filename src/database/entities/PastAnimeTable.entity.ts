import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './UserTable.entity';
import { Anime } from './AnimeTable.entity';

@Entity()
export class PastAnime {
  @PrimaryColumn()
  anime_id: number;

  @PrimaryColumn()
  user_id: number;

  @Column()
  watching_start_date: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Anime)
  @JoinColumn({ name: 'anime_id' })
  anime: Anime;
}
