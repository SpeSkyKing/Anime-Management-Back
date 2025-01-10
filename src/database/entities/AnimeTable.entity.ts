import { Entity, PrimaryGeneratedColumn, Unique, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './UserTable.entity';

@Entity()
export class Anime {
  @PrimaryGeneratedColumn()
  anime_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  anime_name: string;

  @Column()
  episode: number;

  @Column()
  favoriteCharacter: string;

  @Column()
  speed: boolean;
}
