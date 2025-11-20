import {MigrationInterface, QueryRunner} from "typeorm";

export class StudentPatronymAdd1763399305757 implements MigrationInterface {
    name = 'StudentPatronymAdd1763399305757'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "students"
            ADD "patronym" character varying(50) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "students" DROP COLUMN "patronym"
        `);
    }

}
