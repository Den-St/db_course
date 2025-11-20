import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTables1762885067940 implements MigrationInterface {
    name = 'CreateTables1762885067940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM(
                'admin',
                'teacher',
                'student',
                'parent',
                'accountant'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "email" character varying(100) NOT NULL,
                "password_hash" character varying(255) NOT NULL,
                "role" "public"."users_role_enum" NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "teachers" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "first_name" character varying(50) NOT NULL,
                "last_name" character varying(50) NOT NULL,
                "full_name" character varying(120) NOT NULL,
                "specialization" character varying(100),
                "contact_phone" character varying(20),
                "hire_date" date NOT NULL DEFAULT ('now'::text)::date,
                CONSTRAINT "UQ_4668d4752e6766682d1be0b346f" UNIQUE ("user_id"),
                CONSTRAINT "UQ_89ddcc88645a7afea4897d90787" UNIQUE ("contact_phone"),
                CONSTRAINT "PK_a8d4f83be3abe4c687b0a0093c8" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "courses" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "description" text,
                "mandatory" boolean NOT NULL DEFAULT false,
                "grade_level" integer,
                "teacher_id" integer,
                CONSTRAINT "UQ_6ba1a54849ae17832337a39d5e5" UNIQUE ("name"),
                CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "assignments" (
                "id" SERIAL NOT NULL,
                "course_id" integer,
                "teacher_id" integer,
                "title" character varying(150) NOT NULL,
                "description" text,
                "assign_date" date NOT NULL DEFAULT ('now'::text)::date,
                "due_date" date NOT NULL,
                "max_grade" numeric(5, 2) NOT NULL DEFAULT '100',
                CONSTRAINT "PK_c54ca359535e0012b04dcbd80ee" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "parents" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "first_name" character varying(50) NOT NULL,
                "last_name" character varying(50) NOT NULL,
                "phone" character varying(20),
                "email" character varying(100),
                CONSTRAINT "UQ_c94c3cea9b43a18c81269ded41d" UNIQUE ("user_id"),
                CONSTRAINT "UQ_fc60e6197aa92fb4aed997cadd8" UNIQUE ("phone"),
                CONSTRAINT "UQ_07b4151ae2a983823d922d5cf03" UNIQUE ("email"),
                CONSTRAINT "PK_9a4dc67c7b8e6a9cb918938d353" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "groups" (
                "id" SERIAL NOT NULL,
                "name" character varying(100) NOT NULL,
                "grade_level" integer NOT NULL,
                "start_year" integer,
                "curator_id" integer,
                CONSTRAINT "UQ_664ea405ae2a10c264d582ee563" UNIQUE ("name"),
                CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "students" (
                "id" SERIAL NOT NULL,
                "user_id" integer NOT NULL,
                "first_name" character varying(50) NOT NULL,
                "last_name" character varying(50) NOT NULL,
                "birth_date" date NOT NULL,
                "phone" character varying(20),
                "average_grade" numeric(5, 2),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "parent_id" integer NOT NULL,
                "group_id" integer,
                CONSTRAINT "UQ_fb3eff90b11bddf7285f9b4e281" UNIQUE ("user_id"),
                CONSTRAINT "UQ_317b86154bca256bdf5432f134c" UNIQUE ("phone"),
                CONSTRAINT "CHK_0a3d1e166b80e0a2821cac7523" CHECK (
                    EXTRACT(
                        YEAR
                        FROM AGE(birth_date)
                    ) >= 6
                ),
                CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "submissions" (
                "id" SERIAL NOT NULL,
                "assignment_id" integer NOT NULL,
                "student_id" integer NOT NULL,
                "submitted_at" TIMESTAMP NOT NULL DEFAULT now(),
                "content" text,
                "grade" numeric(5, 2),
                "is_late" boolean NOT NULL DEFAULT false,
                "feedback_given" boolean NOT NULL DEFAULT false,
                CONSTRAINT "UQ_f043d0d459a667e9396e2a90864" UNIQUE ("assignment_id", "student_id"),
                CONSTRAINT "CHK_9cc4994ba170b363dd08534e46" CHECK (
                    grade >= 0
                    AND grade <= 100
                ),
                CONSTRAINT "PK_10b3be95b8b2fb1e482e07d706b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "assignment_feedback" (
                "id" SERIAL NOT NULL,
                "submission_id" integer,
                "teacher_id" integer,
                "feedback_text" text,
                "feedback_date" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_4250bc07cbc1356c72fda13d6b5" UNIQUE ("submission_id"),
                CONSTRAINT "PK_1650201d68b033d4743e07a4f66" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "lessons" (
                "id" SERIAL NOT NULL,
                "lesson_date" date NOT NULL,
                "start_time" TIME,
                "end_time" TIME,
                "topic" character varying(200),
                "course_id" integer,
                "teacher_id" integer,
                CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "attendance" (
                "id" SERIAL NOT NULL,
                "student_id" integer NOT NULL,
                "lesson_id" integer NOT NULL,
                "attended" boolean NOT NULL DEFAULT false,
                CONSTRAINT "UQ_ea4e8be044e4fb1879e67fdb902" UNIQUE ("student_id", "lesson_id"),
                CONSTRAINT "PK_ee0ffe42c1f1a01e72b725c0cb2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "grades" (
                "id" SERIAL NOT NULL,
                "student_id" integer NOT NULL,
                "course_id" integer NOT NULL,
                "teacher_id" integer,
                "grade" numeric(5, 2),
                "date_given" TIMESTAMP NOT NULL DEFAULT now(),
                "source" character varying(50),
                CONSTRAINT "CHK_2c7b50b14af67f5309163f14eb" CHECK (
                    grade >= 0
                    AND grade <= 100
                ),
                CONSTRAINT "PK_4740fb6f5df2505a48649f1687b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "enrollments" (
                "id" SERIAL NOT NULL,
                "student_id" integer NOT NULL,
                "course_id" integer NOT NULL,
                "enrollment_date" date NOT NULL DEFAULT ('now'::text)::date,
                CONSTRAINT "UQ_850389020f5faddd405e2792634" UNIQUE ("student_id", "course_id"),
                CONSTRAINT "PK_7c0f752f9fb68bf6ed7367ab00f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "grade_changes_log" (
                "id" SERIAL NOT NULL,
                "grade_id" integer,
                "student_id" integer,
                "old_grade" numeric(5, 2),
                "new_grade" numeric(5, 2),
                "change_date" TIMESTAMP NOT NULL DEFAULT now(),
                "changed_by_teacher_id" integer,
                "note" text,
                CONSTRAINT "PK_90dd2cb822f83b700f77cf987fb" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "tuition_fees" (
                "id" SERIAL NOT NULL,
                "group_id" integer,
                "period_start" date NOT NULL,
                "period_end" date NOT NULL,
                "amount" numeric(10, 2),
                "due_date" date NOT NULL,
                "description" text,
                CONSTRAINT "CHK_81dc7bed75a0db7bdb718c46cc" CHECK (amount >= 0),
                CONSTRAINT "PK_46da2a01341b2fb6c10c7b9428d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payments" (
                "id" SERIAL NOT NULL,
                "student_id" integer,
                "tuition_fee_id" integer,
                "amount_paid" numeric(10, 2),
                "payment_date" date NOT NULL DEFAULT ('now'::text)::date,
                "payment_method" character varying(50),
                "receipt_reference" character varying(100),
                CONSTRAINT "CHK_efbdf69f2e25ed5e6781229e5e" CHECK (amount_paid >= 0),
                CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "teachers"
            ADD CONSTRAINT "FK_4668d4752e6766682d1be0b346f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "courses"
            ADD CONSTRAINT "FK_fad76a730ee7f68d0a59652fb12" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "assignments"
            ADD CONSTRAINT "FK_33f833f305070d2d4e6305d8a0c" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "assignments"
            ADD CONSTRAINT "FK_27322fa090b5deacc5785fcb94c" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "parents"
            ADD CONSTRAINT "FK_c94c3cea9b43a18c81269ded41d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "groups"
            ADD CONSTRAINT "FK_3cd75e92d6709065c4e29c52914" FOREIGN KEY ("curator_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ADD CONSTRAINT "FK_fb3eff90b11bddf7285f9b4e281" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ADD CONSTRAINT "FK_209313beb8d3f51f7ad69214d90" FOREIGN KEY ("parent_id") REFERENCES "parents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "students"
            ADD CONSTRAINT "FK_b9f6fcd8a397ee5b503191dd7c3" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "submissions"
            ADD CONSTRAINT "FK_8723840b9b0464206640c268abc" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "submissions"
            ADD CONSTRAINT "FK_435def3bbd4b4bbb9de1209cdae" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "assignment_feedback"
            ADD CONSTRAINT "FK_4250bc07cbc1356c72fda13d6b5" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "assignment_feedback"
            ADD CONSTRAINT "FK_af3c574c7db66a34a325d35e449" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "lessons"
            ADD CONSTRAINT "FK_3c4e299cf8ed04093935e2e22fe" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "lessons"
            ADD CONSTRAINT "FK_91eb3280b50fe17091b191bbd98" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "attendance"
            ADD CONSTRAINT "FK_6200532f3ef99f639a27bdcae7f" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "attendance"
            ADD CONSTRAINT "FK_231d6c08ae2a023f6e64fef4b5f" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "grades"
            ADD CONSTRAINT "FK_9acca493883cee3b9e8f9e01cd1" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "grades"
            ADD CONSTRAINT "FK_9a927cab52e881e0aa78f8a181b" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "grades"
            ADD CONSTRAINT "FK_4e40960913bb4a4c059fa9939d6" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments"
            ADD CONSTRAINT "FK_307813fe255896d6ebf3e6cd55c" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments"
            ADD CONSTRAINT "FK_b79d0bf01779fdf9cfb6b092af3" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "grade_changes_log"
            ADD CONSTRAINT "FK_065d69dc6aab9c7a9e66996262b" FOREIGN KEY ("grade_id") REFERENCES "grades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "grade_changes_log"
            ADD CONSTRAINT "FK_27b998790b1c3d328fa6501c35a" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "grade_changes_log"
            ADD CONSTRAINT "FK_babcb0b7f8878fd38225ec9e560" FOREIGN KEY ("changed_by_teacher_id") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees"
            ADD CONSTRAINT "FK_3ae51c567d0f10c56cc5244b9d0" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD CONSTRAINT "FK_9fd5d6ef620b0140a67ff2d95c4" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD CONSTRAINT "FK_77c05d898112babe894010b9394" FOREIGN KEY ("tuition_fee_id") REFERENCES "tuition_fees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payments" DROP CONSTRAINT "FK_77c05d898112babe894010b9394"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments" DROP CONSTRAINT "FK_9fd5d6ef620b0140a67ff2d95c4"
        `);
        await queryRunner.query(`
            ALTER TABLE "tuition_fees" DROP CONSTRAINT "FK_3ae51c567d0f10c56cc5244b9d0"
        `);
        await queryRunner.query(`
            ALTER TABLE "grade_changes_log" DROP CONSTRAINT "FK_babcb0b7f8878fd38225ec9e560"
        `);
        await queryRunner.query(`
            ALTER TABLE "grade_changes_log" DROP CONSTRAINT "FK_27b998790b1c3d328fa6501c35a"
        `);
        await queryRunner.query(`
            ALTER TABLE "grade_changes_log" DROP CONSTRAINT "FK_065d69dc6aab9c7a9e66996262b"
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments" DROP CONSTRAINT "FK_b79d0bf01779fdf9cfb6b092af3"
        `);
        await queryRunner.query(`
            ALTER TABLE "enrollments" DROP CONSTRAINT "FK_307813fe255896d6ebf3e6cd55c"
        `);
        await queryRunner.query(`
            ALTER TABLE "grades" DROP CONSTRAINT "FK_4e40960913bb4a4c059fa9939d6"
        `);
        await queryRunner.query(`
            ALTER TABLE "grades" DROP CONSTRAINT "FK_9a927cab52e881e0aa78f8a181b"
        `);
        await queryRunner.query(`
            ALTER TABLE "grades" DROP CONSTRAINT "FK_9acca493883cee3b9e8f9e01cd1"
        `);
        await queryRunner.query(`
            ALTER TABLE "attendance" DROP CONSTRAINT "FK_231d6c08ae2a023f6e64fef4b5f"
        `);
        await queryRunner.query(`
            ALTER TABLE "attendance" DROP CONSTRAINT "FK_6200532f3ef99f639a27bdcae7f"
        `);
        await queryRunner.query(`
            ALTER TABLE "lessons" DROP CONSTRAINT "FK_91eb3280b50fe17091b191bbd98"
        `);
        await queryRunner.query(`
            ALTER TABLE "lessons" DROP CONSTRAINT "FK_3c4e299cf8ed04093935e2e22fe"
        `);
        await queryRunner.query(`
            ALTER TABLE "assignment_feedback" DROP CONSTRAINT "FK_af3c574c7db66a34a325d35e449"
        `);
        await queryRunner.query(`
            ALTER TABLE "assignment_feedback" DROP CONSTRAINT "FK_4250bc07cbc1356c72fda13d6b5"
        `);
        await queryRunner.query(`
            ALTER TABLE "submissions" DROP CONSTRAINT "FK_435def3bbd4b4bbb9de1209cdae"
        `);
        await queryRunner.query(`
            ALTER TABLE "submissions" DROP CONSTRAINT "FK_8723840b9b0464206640c268abc"
        `);
        await queryRunner.query(`
            ALTER TABLE "students" DROP CONSTRAINT "FK_b9f6fcd8a397ee5b503191dd7c3"
        `);
        await queryRunner.query(`
            ALTER TABLE "students" DROP CONSTRAINT "FK_209313beb8d3f51f7ad69214d90"
        `);
        await queryRunner.query(`
            ALTER TABLE "students" DROP CONSTRAINT "FK_fb3eff90b11bddf7285f9b4e281"
        `);
        await queryRunner.query(`
            ALTER TABLE "groups" DROP CONSTRAINT "FK_3cd75e92d6709065c4e29c52914"
        `);
        await queryRunner.query(`
            ALTER TABLE "parents" DROP CONSTRAINT "FK_c94c3cea9b43a18c81269ded41d"
        `);
        await queryRunner.query(`
            ALTER TABLE "assignments" DROP CONSTRAINT "FK_27322fa090b5deacc5785fcb94c"
        `);
        await queryRunner.query(`
            ALTER TABLE "assignments" DROP CONSTRAINT "FK_33f833f305070d2d4e6305d8a0c"
        `);
        await queryRunner.query(`
            ALTER TABLE "courses" DROP CONSTRAINT "FK_fad76a730ee7f68d0a59652fb12"
        `);
        await queryRunner.query(`
            ALTER TABLE "teachers" DROP CONSTRAINT "FK_4668d4752e6766682d1be0b346f"
        `);
        await queryRunner.query(`
            DROP TABLE "payments"
        `);
        await queryRunner.query(`
            DROP TABLE "tuition_fees"
        `);
        await queryRunner.query(`
            DROP TABLE "grade_changes_log"
        `);
        await queryRunner.query(`
            DROP TABLE "enrollments"
        `);
        await queryRunner.query(`
            DROP TABLE "grades"
        `);
        await queryRunner.query(`
            DROP TABLE "attendance"
        `);
        await queryRunner.query(`
            DROP TABLE "lessons"
        `);
        await queryRunner.query(`
            DROP TABLE "assignment_feedback"
        `);
        await queryRunner.query(`
            DROP TABLE "submissions"
        `);
        await queryRunner.query(`
            DROP TABLE "students"
        `);
        await queryRunner.query(`
            DROP TABLE "groups"
        `);
        await queryRunner.query(`
            DROP TABLE "parents"
        `);
        await queryRunner.query(`
            DROP TABLE "assignments"
        `);
        await queryRunner.query(`
            DROP TABLE "courses"
        `);
        await queryRunner.query(`
            DROP TABLE "teachers"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `);
    }

}
