import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1737177698254 implements MigrationInterface {
    name = 'CreateTable1737177698254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "anime" ADD "iswatched" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "anime" DROP CONSTRAINT "FK_79fdd0083ee77b8f2b39e1753c6"`);
        await queryRunner.query(`ALTER TABLE "viewed_anime" DROP CONSTRAINT "FK_f0b972fe45bea464f6719547cd8"`);
        await queryRunner.query(`ALTER TABLE "past_anime" DROP CONSTRAINT "FK_c4e523dc87a9e3d78b0727040a1"`);
        await queryRunner.query(`ALTER TABLE "current_anime" DROP CONSTRAINT "FK_c0e31e9153ba1af3c9d4ad209bd"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_758b8ce7c18b9d347461b30228d" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "current_anime" DROP CONSTRAINT "PK_0649cd1e0b5cdda774c3ac9e262"`);
        await queryRunner.query(`ALTER TABLE "current_anime" ADD CONSTRAINT "PK_7871aec28121753450815bc3ad4" PRIMARY KEY ("anime_id", "user_id")`);
        await queryRunner.query(`ALTER TABLE "current_anime" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "current_anime" ADD "year" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "current_anime" DROP CONSTRAINT "PK_7871aec28121753450815bc3ad4"`);
        await queryRunner.query(`ALTER TABLE "current_anime" ADD CONSTRAINT "PK_0649cd1e0b5cdda774c3ac9e262" PRIMARY KEY ("anime_id", "user_id", "year")`);
        await queryRunner.query(`ALTER TABLE "anime" ADD CONSTRAINT "FK_79fdd0083ee77b8f2b39e1753c6" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "viewed_anime" ADD CONSTRAINT "FK_f0b972fe45bea464f6719547cd8" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "current_anime" ADD CONSTRAINT "FK_c0e31e9153ba1af3c9d4ad209bd" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "past_anime" ADD CONSTRAINT "FK_c4e523dc87a9e3d78b0727040a1" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "past_anime" DROP CONSTRAINT "FK_c4e523dc87a9e3d78b0727040a1"`);
        await queryRunner.query(`ALTER TABLE "current_anime" DROP CONSTRAINT "FK_c0e31e9153ba1af3c9d4ad209bd"`);
        await queryRunner.query(`ALTER TABLE "viewed_anime" DROP CONSTRAINT "FK_f0b972fe45bea464f6719547cd8"`);
        await queryRunner.query(`ALTER TABLE "anime" DROP CONSTRAINT "FK_79fdd0083ee77b8f2b39e1753c6"`);
        await queryRunner.query(`ALTER TABLE "current_anime" DROP CONSTRAINT "PK_0649cd1e0b5cdda774c3ac9e262"`);
        await queryRunner.query(`ALTER TABLE "current_anime" ADD CONSTRAINT "PK_7871aec28121753450815bc3ad4" PRIMARY KEY ("anime_id", "user_id")`);
        await queryRunner.query(`ALTER TABLE "current_anime" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "current_anime" ADD "year" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "current_anime" DROP CONSTRAINT "PK_7871aec28121753450815bc3ad4"`);
        await queryRunner.query(`ALTER TABLE "current_anime" ADD CONSTRAINT "PK_0649cd1e0b5cdda774c3ac9e262" PRIMARY KEY ("anime_id", "user_id", "year")`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_758b8ce7c18b9d347461b30228d"`);
        await queryRunner.query(`ALTER TABLE "current_anime" ADD CONSTRAINT "FK_c0e31e9153ba1af3c9d4ad209bd" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "past_anime" ADD CONSTRAINT "FK_c4e523dc87a9e3d78b0727040a1" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "viewed_anime" ADD CONSTRAINT "FK_f0b972fe45bea464f6719547cd8" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "anime" ADD CONSTRAINT "FK_79fdd0083ee77b8f2b39e1753c6" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "anime" DROP COLUMN "iswatched"`);
    }

}
