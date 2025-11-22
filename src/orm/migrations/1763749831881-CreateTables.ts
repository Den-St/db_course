import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTables1763749831881 implements MigrationInterface {
    name = 'CreateTables1763749831881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tuition_fees" DROP CONSTRAINT "FK_3ae51c567d0f10c56cc5244b9d0"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees" DROP COLUMN "group_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
            ADD "student_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
            ADD "payment_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
            ADD CONSTRAINT "UQ_2946a6930af5b4971ea47584590" UNIQUE ("payment_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ADD "tuition_fee_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
            ADD CONSTRAINT "FK_40bc74349ddf549577a3e50480d" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
            ADD CONSTRAINT "FK_2946a6930af5b4971ea47584590" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tuition_fees" DROP CONSTRAINT "FK_2946a6930af5b4971ea47584590"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees" DROP CONSTRAINT "FK_40bc74349ddf549577a3e50480d"
        `);
        await queryRunner.query(`
            ALTER TABLE "students" DROP COLUMN "tuition_fee_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees" DROP CONSTRAINT "UQ_2946a6930af5b4971ea47584590"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees" DROP COLUMN "payment_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees" DROP COLUMN "student_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
            ADD "group_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
            ADD CONSTRAINT "FK_3ae51c567d0f10c56cc5244b9d0" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
