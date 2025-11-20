import {MigrationInterface, QueryRunner} from "typeorm";

export class StudentGroupIdNullable1763456703402 implements MigrationInterface {
    name = 'StudentGroupIdNullable1763456703402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "courses" DROP CONSTRAINT "FK_fad76a730ee7f68d0a59652fb12"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ALTER COLUMN "teacher_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD CONSTRAINT "FK_fad76a730ee7f68d0a59652fb12" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "courses" DROP CONSTRAINT "FK_fad76a730ee7f68d0a59652fb12"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ALTER COLUMN "teacher_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD CONSTRAINT "FK_fad76a730ee7f68d0a59652fb12" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
