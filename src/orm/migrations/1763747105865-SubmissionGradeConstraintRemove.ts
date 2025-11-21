import {MigrationInterface, QueryRunner} from "typeorm";

export class SubmissionGradeConstraintRemove1763747105865 implements MigrationInterface {
    name = 'SubmissionGradeConstraintRemove1763747105865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
            ADD "payment_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees" DROP CONSTRAINT "FK_40bc74349ddf549577a3e50480d"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
            ADD CONSTRAINT "UQ_40bc74349ddf549577a3e50480d" UNIQUE ("student_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
            ADD CONSTRAINT "FK_40bc74349ddf549577a3e50480d" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tuition_fees" DROP CONSTRAINT "FK_40bc74349ddf549577a3e50480d"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees" DROP CONSTRAINT "FK_40bc74349ddf549577a3e50480d"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees" DROP CONSTRAINT "UQ_40bc74349ddf549577a3e50480d"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
            ADD CONSTRAINT "FK_40bc74349ddf549577a3e50480d" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees" DROP COLUMN "payment_id"
        `);
    }

}
