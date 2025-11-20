import {MigrationInterface, QueryRunner} from "typeorm";

export class GradeSubmissionsOneToOne1763655373215 implements MigrationInterface {
    name = 'GradeSubmissionsOneToOne1763655373215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "grades"
                RENAME COLUMN "comment" TO "submission_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "submissions"
                RENAME COLUMN "grade" TO "grade_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "students" DROP CONSTRAINT "FK_b9f6fcd8a397ee5b503191dd7c3"
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ALTER COLUMN "group_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "grades" DROP COLUMN "submission_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "grades"
            ADD "submission_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "submissions" DROP COLUMN "grade_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "submissions"
            ADD "grade_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "submissions"
            ADD CONSTRAINT "UQ_46365a727b23336f6eaccfb7ffa" UNIQUE ("grade_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ADD CONSTRAINT "FK_b9f6fcd8a397ee5b503191dd7c3" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "submissions"
            ADD CONSTRAINT "FK_46365a727b23336f6eaccfb7ffa" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "submissions" DROP CONSTRAINT "FK_46365a727b23336f6eaccfb7ffa"
        `);
        await queryRunner.query(`
            ALTER TABLE "students" DROP CONSTRAINT "FK_b9f6fcd8a397ee5b503191dd7c3"
        `);
        await queryRunner.query(`
            ALTER TABLE "submissions" DROP CONSTRAINT "UQ_46365a727b23336f6eaccfb7ffa"
        `);
        await queryRunner.query(`
            ALTER TABLE "submissions" DROP COLUMN "grade_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "submissions"
            ADD "grade_id" numeric(5, 2)
        `);
        await queryRunner.query(`
            ALTER TABLE "grades" DROP COLUMN "submission_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "grades"
            ADD "submission_id" character varying(50)
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ALTER COLUMN "group_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ADD CONSTRAINT "FK_b9f6fcd8a397ee5b503191dd7c3" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "submissions"
                RENAME COLUMN "grade_id" TO "grade"
        `);
        await queryRunner.query(`
            ALTER TABLE "grades"
                RENAME COLUMN "submission_id" TO "comment"
        `);
    }

}
