import { Entity, PrimaryColumn ,Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './UserTable.entity';
import { Anime } from './AnimeTable.entity';

@Entity()
export class CurrentAnime {
  @PrimaryColumn()
  anime_id: number;

  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  year: number;

  @Column('enum', { enum: ['1', '2', '3', '4'] })
  season: string;

  @Column()
  releaseDate: Date;

  @Column('enum', { enum: ['1', '2', '3', '4', '5', '6', '7'] })
  delivery_weekday: string;

  @Column()
  delivery_time: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Anime)
  @JoinColumn({ name: 'anime_id' })
  anime: Anime;
}
