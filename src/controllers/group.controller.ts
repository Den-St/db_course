import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { GroupService } from '../services/group.service';
import { CreateGroupDto } from '../dtos/group.dto';

export class GroupController {
  private groupService = new GroupService();

  async createGroup(req: Request, res: Response): Promise<void> {
    try {
      // Transform and validate request body
      const createGroupDto = plainToClass(CreateGroupDto, req.body);
      const errors = await validate(createGroupDto);

      if (errors.length > 0) {
        res.status(400).json({
          message: 'Validation failed',
          errors: errors.map(err => ({
            property: err.property,
            constraints: err.constraints
          }))
        });
        return;
      }

      // Create group
      const group = await this.groupService.createGroup(createGroupDto);

      res.status(201).json({
        message: 'Group created successfully',
        data: group
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          message: error.message
        });
      } else {
        res.status(500).json({
          message: 'Internal server error'
        });
      }
    }
  }
}
