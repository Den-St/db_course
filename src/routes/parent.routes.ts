import { Router } from 'express';

import { catchAsync } from 'utils/catchAsync';

import { createParent } from '../controllers/parents/createParent';
import { deleteParent } from '../controllers/parents/deleteParent';
import { findAllParents } from '../controllers/parents/findAllParents';
import { findOneParent } from '../controllers/parents/findOneParent';
import { updateParent } from '../controllers/parents/updateParent';
import { validateCreateParent } from '../middleware/validation/parents/validateCreateParent';

const router = Router();

router.post('/', validateCreateParent, catchAsync(createParent));
router.get('/', catchAsync(findAllParents));
router.get('/:id', catchAsync(findOneParent));
router.put('/:id', catchAsync(updateParent));
router.delete('/:id', catchAsync(deleteParent));

export { router as parentRoutes };
