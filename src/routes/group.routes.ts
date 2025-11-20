import { Router } from 'express';
import { GroupController } from '../controllers/group.controller';
import { catchAsync } from 'utils/catchAsync';

const router = Router();
const groupController = new GroupController();

router.post('/create', catchAsync(groupController.createGroup));

export default router;
