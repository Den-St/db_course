import {MigrationInterface, QueryRunner} from "typeorm";

export class GradesChangeLogTrigger1763487933369 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        //
        // 1. Create trigger function
        //
        await queryRunner.query(`
          CREATE OR REPLACE FUNCTION log_grade_change()
          RETURNS TRIGGER AS $$
          BEGIN
            -- Handle INSERT (new grade created)
            IF TG_OP = 'INSERT' THEN
              INSERT INTO grade_changes_log(
                grade_id,
                student_id,
                old_grade,
                new_grade,
                changed_by_teacher_id,
                note
              )
              VALUES (
                NEW.id,
                NEW.student_id,
                NULL,          -- no old value
                NEW.grade,     -- new grade
                NEW.teacher_id,
                'Grade created'
              );
              RETURN NEW;
            END IF;
    
            -- Handle UPDATE (grade modified)
            IF TG_OP = 'UPDATE' THEN
              INSERT INTO grade_changes_log(
                grade_id,
                student_id,
                old_grade,
                new_grade,
                changed_by_teacher_id,
                note
              )
              VALUES (
                NEW.id,
                NEW.student_id,
                OLD.grade,     -- old grade
                NEW.grade,     -- updated grade
                NEW.teacher_id,
                'Grade updated'
              );
              RETURN NEW;
            END IF;
    
            RETURN NULL;
          END;
          $$ LANGUAGE plpgsql;
        `);
    
        //
        // 2. Create AFTER INSERT trigger
        //
        await queryRunner.query(`
          CREATE TRIGGER grade_insert_log_trigger
          AFTER INSERT ON grades
          FOR EACH ROW
          EXECUTE FUNCTION log_grade_change();
        `);
    
        //
        // 3. Create AFTER UPDATE trigger
        //
        await queryRunner.query(`
          CREATE TRIGGER grade_update_log_trigger
          AFTER UPDATE OF grade ON grades
          FOR EACH ROW
          WHEN (OLD.grade IS DISTINCT FROM NEW.grade)
          EXECUTE FUNCTION log_grade_change();
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS grade_update_log_trigger ON grades;`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS grade_insert_log_trigger ON grades;`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS log_grade_change;`);
      }
}
