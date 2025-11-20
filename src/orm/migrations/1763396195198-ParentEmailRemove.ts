import {MigrationInterface, QueryRunner} from "typeorm";

export class ParentEmailRemove1763396195198 implements MigrationInterface {
    name = 'ParentEmailRemove1763396195198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "parents" DROP CONSTRAINT "UQ_07b4151ae2a983823d922d5cf03"
        `);
        await queryRunner.query(`
            ALTER TABLE "parents" DROP COLUMN "email"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "parents"
            ADD "email" character varying(100)
        `);
        await queryRunner.query(`
            ALTER TABLE "parents"
            ADD CONSTRAINT "UQ_07b4151ae2a983823d922d5cf03" UNIQUE ("email")
        `);
    }

}
