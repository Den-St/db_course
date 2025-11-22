import {MigrationInterface, QueryRunner} from "typeorm";

export class PaymentRemoveStudent1763752827672 implements MigrationInterface {
    name = 'PaymentRemoveStudent1763752827672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payments" DROP CONSTRAINT "FK_9fd5d6ef620b0140a67ff2d95c4"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments" DROP COLUMN "student_id"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD "student_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD CONSTRAINT "FK_9fd5d6ef620b0140a67ff2d95c4" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
