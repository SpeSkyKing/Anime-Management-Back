import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1736573806107 implements MigrationInterface {
    name = 'CreateTable1736573806107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("user_id" integer NOT NULL, "user_name" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_758b8ce7c18b9d347461b30228d" UNIQUE ("user_id"), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "anime" ("anime_id" SERIAL NOT NULL, "anime_name" character varying NOT NULL, "episode" integer NOT NULL, "favoriteCharacter" character varying NOT NULL, "speed" boolean NOT NULL, "user_id" integer, CONSTRAINT "PK_9ea3a381adb28eccbf652ff2196" PRIMARY KEY ("anime_id"))`);
        await queryRunner.query(`CREATE TABLE "viewed_anime" ("anime_id" integer NOT NULL, "user_id" integer NOT NULL, "viewed_end_date" TIMESTAMP NOT NULL, CONSTRAINT "PK_02084c9ea7ecf7df76752e41d6d" PRIMARY KEY ("anime_id", "user_id", "viewed_end_date"))`);
        await queryRunner.query(`CREATE TABLE "past_anime" ("anime_id" integer NOT NULL, "user_id" integer NOT NULL, "watching_start_date" TIMESTAMP NOT NULL, CONSTRAINT "PK_4eb8440d26bb6a2036a1d28b559" PRIMARY KEY ("anime_id", "user_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."current_anime_season_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TYPE "public"."current_anime_delivery_weekday_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7')`);
        await queryRunner.query(`CREATE TABLE "current_anime" ("anime_id" integer NOT NULL, "user_id" integer NOT NULL, "year" TIMESTAMP NOT NULL, "season" "public"."current_anime_season_enum" NOT NULL, "releaseDate" TIMESTAMP NOT NULL, "delivery_weekday" "public"."current_anime_delivery_weekday_enum" NOT NULL, "delivery_time" character varying NOT NULL, CONSTRAINT "PK_0649cd1e0b5cdda774c3ac9e262" PRIMARY KEY ("anime_id", "user_id", "year"))`);
        await queryRunner.query(`ALTER TABLE "anime" ADD CONSTRAINT "FK_79fdd0083ee77b8f2b39e1753c6" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "viewed_anime" ADD CONSTRAINT "FK_f0b972fe45bea464f6719547cd8" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "viewed_anime" ADD CONSTRAINT "FK_9a2bb004f147ba04913f1d68c87" FOREIGN KEY ("anime_id") REFERENCES "anime"("anime_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "past_anime" ADD CONSTRAINT "FK_c4e523dc87a9e3d78b0727040a1" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "past_anime" ADD CONSTRAINT "FK_d68c40a8d748f8b8f7f61987736" FOREIGN KEY ("anime_id") REFERENCES "anime"("anime_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "current_anime" ADD CONSTRAINT "FK_c0e31e9153ba1af3c9d4ad209bd" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "current_anime" ADD CONSTRAINT "FK_5e38363650b966dc65c8cc8c64a" FOREIGN KEY ("anime_id") REFERENCES "anime"("anime_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "current_anime" DROP CONSTRAINT "FK_5e38363650b966dc65c8cc8c64a"`);
        await queryRunner.query(`ALTER TABLE "current_anime" DROP CONSTRAINT "FK_c0e31e9153ba1af3c9d4ad209bd"`);
        await queryRunner.query(`ALTER TABLE "past_anime" DROP CONSTRAINT "FK_d68c40a8d748f8b8f7f61987736"`);
        await queryRunner.query(`ALTER TABLE "past_anime" DROP CONSTRAINT "FK_c4e523dc87a9e3d78b0727040a1"`);
        await queryRunner.query(`ALTER TABLE "viewed_anime" DROP CONSTRAINT "FK_9a2bb004f147ba04913f1d68c87"`);
        await queryRunner.query(`ALTER TABLE "viewed_anime" DROP CONSTRAINT "FK_f0b972fe45bea464f6719547cd8"`);
        await queryRunner.query(`ALTER TABLE "anime" DROP CONSTRAINT "FK_79fdd0083ee77b8f2b39e1753c6"`);
        await queryRunner.query(`DROP TABLE "current_anime"`);
        await queryRunner.query(`DROP TYPE "public"."current_anime_delivery_weekday_enum"`);
        await queryRunner.query(`DROP TYPE "public"."current_anime_season_enum"`);
        await queryRunner.query(`DROP TABLE "past_anime"`);
        await queryRunner.query(`DROP TABLE "viewed_anime"`);
        await queryRunner.query(`DROP TABLE "anime"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
