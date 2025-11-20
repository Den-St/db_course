import {MigrationInterface, QueryRunner} from "typeorm";

export class GradesCommentAdd1763456585805 implements MigrationInterface {
    name = 'GradesCommentAdd1763456585805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "grades"
            ADD "comment" character varying(50)
        `);
        await queryRunner.query(`
            ALTER TABLE "students" DROP CONSTRAINT "FK_b9f6fcd8a397ee5b503191dd7c3"
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ALTER COLUMN "group_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP CONSTRAINT "FK_fad76a730ee7f68d0a59652fb12"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ALTER COLUMN "teacher_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ADD CONSTRAINT "FK_b9f6fcd8a397ee5b503191dd7c3" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "students" DROP CONSTRAINT "FK_b9f6fcd8a397ee5b503191dd7c3"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ALTER COLUMN "teacher_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD CONSTRAINT "FK_fad76a730ee7f68d0a59652fb12" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ALTER COLUMN "group_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ADD CONSTRAINT "FK_b9f6fcd8a397ee5b503191dd7c3" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "grades" DROP COLUMN "comment"
        `);
    }

}
