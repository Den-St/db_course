import {MigrationInterface, QueryRunner} from "typeorm";

export class StudentFeeAdd1763746611180 implements MigrationInterface {
    name = 'StudentFeeAdd1763746611180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tuition_fees" DROP CONSTRAINT "FK_3ae51c567d0f10c56cc5244b9d0"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
                RENAME COLUMN "group_id" TO "student_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ADD "tuition_fee_id" integer
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
            ALTER TABLE "students" DROP COLUMN "tuition_fee_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
                RENAME COLUMN "student_id" TO "group_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
            ADD CONSTRAINT "FK_3ae51c567d0f10c56cc5244b9d0" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
