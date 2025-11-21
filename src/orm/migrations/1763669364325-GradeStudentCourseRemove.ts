import {MigrationInterface, QueryRunner} from "typeorm";

export class GradeStudentCourseRemove1763669364325 implements MigrationInterface {
    name = 'GradeStudentCourseRemove1763669364325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "grades" DROP CONSTRAINT "FK_9a927cab52e881e0aa78f8a181b"
        `);
        await queryRunner.query(`
            ALTER TABLE "grades" DROP CONSTRAINT "FK_9acca493883cee3b9e8f9e01cd1"
        `);
        await queryRunner.query(`
            ALTER TABLE "grades" DROP COLUMN "student_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "grades" DROP COLUMN "course_id"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "grades"
            ADD "course_id" integer NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "grades"
            ADD "student_id" integer NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "grades"
            ADD CONSTRAINT "FK_9acca493883cee3b9e8f9e01cd1" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "grades"
            ADD CONSTRAINT "FK_9a927cab52e881e0aa78f8a181b" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
