import { Group } from '../orm/entities/Group.entity';
import { Teacher } from '../orm/entities/Teacher.entity';
import { CreateGroupDto } from '../dtos/group.dto';
import { getRepository } from 'typeorm';

export class GroupService {
  private groupRepository = getRepository(Group);
  private teacherRepository = getRepository(Teacher);

  async createGroup(data: CreateGroupDto): Promise<Group> {
    // Check if group with this name already exists
    const existingGroup = await this.groupRepository.findOne({
      where: { name: data.name }
    });

    if (existingGroup) {
      throw new Error('Group with this name already exists');
    }

    // If curator_id is provided, validate that the teacher exists
    let curator = null;
    if (data.curator_id) {
      curator = await this.teacherRepository.findOne({
        where: { user_id: data.curator_id }
      });

      if (!curator) {
        throw new Error('Curator not found');
      }
    }

    // Create new group
    const group = this.groupRepository.create({
      name: data.name,
      grade_level: data.grade_level,
      start_year: data.start_year,
      curator: curator
    });

    return await this.groupRepository.save(group);
  }
}
