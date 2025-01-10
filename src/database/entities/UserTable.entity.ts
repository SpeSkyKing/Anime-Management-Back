import { Entity, Unique ,PrimaryColumn, Column } from 'typeorm';

@Entity()
@Unique(["user_id"])
export class User {
  @PrimaryColumn()
  user_id: number;

  @Column()
  user_name: string;

  @Column()
  password: string;
}
